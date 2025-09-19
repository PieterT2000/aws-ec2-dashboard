import { ec2Client } from "./aws-config";
import { DescribeInstancesCommand, Instance } from "@aws-sdk/client-ec2";
import { getInstanceMetrics } from "./cloudwatch";
import { getEC2CostStats } from "./cost-explorer";

export async function getEC2InstanceTabularData(
  startDate: string,
  endDate: string
) {
  const instances = await getEC2Instances();
  const instanceIds =
    instances
      ?.map((instance) => instance.id)
      .filter((id) => id !== undefined) || [];

  const metricsForInstances = await getInstanceMetrics(
    instanceIds,
    startDate,
    endDate
  );

  // Compute costs stats for the provided date range
  const instanceCostStats = await getEC2CostStats(instanceIds, {
    startDate,
    endDate,
  });

  const instancesWithMetrics = instances
    ?.filter((instance) => instance.id)
    .map((instance) => ({
      ...instance,
      metrics: metricsForInstances?.find(
        (metric) => metric.instanceId === instance.id!
      )?.metrics,
      costStats: instanceCostStats[instance.id!] as
        | {
            totalCost: number;
            avgCost: number;
          }
        | undefined,
    }));
  return instancesWithMetrics;
}

export type EC2InstanceTabularData = NonNullable<
  Awaited<ReturnType<typeof getEC2InstanceTabularData>>
>;

export async function getEC2Instances() {
  const instancesCommand = new DescribeInstancesCommand({});
  const instancesResponse = await ec2Client.send(instancesCommand);

  // const statusesCommand = new DescribeInstanceStatusCommand({});
  // const statusesResponse = await ec2Client.send(statusesCommand);

  return instancesResponse.Reservations?.flatMap((reservation) => {
    return (
      reservation.Instances?.map((instance) => {
        return {
          id: instance.InstanceId,
          state: instance.State?.Name || "unknown",
          type: instance.InstanceType || "unknown",
          launchTime: instance.LaunchTime,
          region: instance.Placement?.AvailabilityZone,
          name: instance.Tags?.find((tag) => tag.Key?.toLowerCase() === "name")
            ?.Value,
          tags: instance.Tags?.reduce((acc, tag) => {
            if (!tag.Key) return acc;
            acc[tag.Key] = tag.Value;
            return acc;
          }, {} as Record<string, string | undefined>),
          uptime: getUptime(instance),
        };
      }) || []
    );
  });
}

export type EC2Instances = Awaited<ReturnType<typeof getEC2Instances>>;

function getUptime(instance: Instance) {
  const launchTime = instance.LaunchTime?.getTime();
  if (!launchTime) return 0;
  const now = new Date().getTime();
  const uptime = now - launchTime;
  return uptime;
}
