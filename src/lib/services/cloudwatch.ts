import { cloudwatchClient } from "./aws-config";
import {
  GetMetricStatisticsCommand,
  ListMetricsCommand,
} from "@aws-sdk/client-cloudwatch";

export async function getInstanceMetrics(
  instanceIds: string[],
  startDate: string,
  endDate: string
) {
  if (!instanceIds || instanceIds.length === 0) {
    return [];
  }

  // Convert date strings to Date objects
  const startTime = new Date(startDate);
  const endTime = new Date(endDate);

  // Validate dates
  if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
    throw new Error("Invalid date format provided to getInstanceMetrics");
  }

  const period = 60 * 60; // 1 hour

  const cmdArgs = {
    EndTime: endTime,
    StartTime: startTime,
    Period: period,
  };

  return Promise.all(
    instanceIds.map(async (id) => {
      const [cpuUsagePercent, memoryUsagePercent, diskUsagePercent] =
        await Promise.all([
          getCpuUsagePercent(id, cmdArgs),
          getMemoryUsagePercent(id, cmdArgs),
          getDiskUsagePercent(id, cmdArgs),
        ]);

      return {
        instanceId: id,
        metrics: {
          cpuUsagePercent,
          memoryUsagePercent,
          diskUsagePercent,
        },
      };
    })
  );
}

export type InstanceMetrics = Awaited<ReturnType<typeof getInstanceMetrics>>;

async function getCpuUsagePercent(
  instanceId: string,
  cmdArgs: {
    EndTime: Date;
    StartTime: Date;
    Period: number;
  }
) {
  const cpuUsagePercentCmd = new GetMetricStatisticsCommand({
    Namespace: "AWS/EC2",
    MetricName: "CPUUtilization",
    Dimensions: [{ Name: "InstanceId", Value: instanceId }],
    Statistics: ["Average"],
    ...cmdArgs,
  });
  const response = await cloudwatchClient.send(cpuUsagePercentCmd);
  return response.Datapoints?.[0]?.Average;
}

async function getMemoryUsagePercent(
  instanceId: string,
  cmdArgs: {
    EndTime: Date;
    StartTime: Date;
    Period: number;
  }
) {
  const memoryUsagePercentCmd = new GetMetricStatisticsCommand({
    Namespace: "CWAgent",
    MetricName: "mem_used_percent",
    Dimensions: [{ Name: "InstanceId", Value: instanceId }],
    Statistics: ["Average"],
    ...cmdArgs,
  });
  const response = await cloudwatchClient.send(memoryUsagePercentCmd);
  return response.Datapoints?.[0]?.Average;
}

async function getDiskUsagePercent(
  instanceId: string,
  cmdArgs: {
    EndTime: Date;
    StartTime: Date;
    Period: number;
  }
) {
  // A multi-dimensional metric like disk_used_percent is identified by its dimensions
  // Hence, we first find the corresponding dimensions and use them when querying the metric
  const dimensions = await getDiskUsagePercentDimensions(instanceId);
  const diskUsagePercentCmd = new GetMetricStatisticsCommand({
    Namespace: "CWAgent",
    MetricName: "disk_used_percent",
    Dimensions: dimensions,
    Statistics: ["Average"],
    ...cmdArgs,
  });
  const response = await cloudwatchClient.send(diskUsagePercentCmd);
  return response.Datapoints?.[0]?.Average;
}

async function getDiskUsagePercentDimensions(instanceId: string) {
  const listCommand = new ListMetricsCommand({
    Namespace: "CWAgent",
    MetricName: "disk_used_percent",
    Dimensions: [
      { Name: "InstanceId", Value: instanceId },
      { Name: "fstype", Value: "ext4" },
      { Name: "path", Value: "/" },
    ],
  });

  const response = await cloudwatchClient.send(listCommand);
  return response.Metrics?.[0]?.Dimensions || [];
}
