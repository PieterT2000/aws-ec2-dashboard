import { EC2InstanceTabularData } from "@/lib/services/ec2";
import { useCostSavings } from "./queries/useCostSavings";

const WEIGHTED_UTILIZATION_RATIOS = {
  cpu: 0.7,
  memory: 0.3,
};

function calculateResourceBasedWaste(
  instance: EC2InstanceTabularData[number]
): number {
  const metrics = instance.metrics;

  if (!metrics || !metrics.cpuUsagePercent || !metrics.memoryUsagePercent)
    return 0;

  // Computed weighted utilization
  const weightedUtilization =
    metrics.cpuUsagePercent * WEIGHTED_UTILIZATION_RATIOS.cpu +
    metrics.memoryUsagePercent * WEIGHTED_UTILIZATION_RATIOS.memory;

  // clamp the waste between 0 and 100
  const waste = Math.max(0, Math.min(100, 100 - weightedUtilization));

  return waste;
}

export function useWithResourceOptimisation(data: EC2InstanceTabularData) {
  const { data: costSavings } = useCostSavings();
  const costSavingsData = costSavings?.data?.recommendations || [];
  return data.map((instance) => ({
    ...instance,
    wasteScore: calculateResourceBasedWaste(instance),
    costSavings: costSavingsData.find(
      (costSaving) => costSaving.resourceId === instance.id
    ),
  }));
}
