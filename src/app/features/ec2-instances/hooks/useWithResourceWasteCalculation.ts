import { EC2InstanceTabularData } from "@/lib/services/ec2";

const WEIGHTED_UTILIZATION_RATIOS = {
  cpu: 0.5,
  memory: 0.4,
  disk: 0.1,
};

function calculateResourceBasedWaste(
  instance: EC2InstanceTabularData[number]
): number {
  const metrics = instance.metrics;

  if (
    !metrics ||
    !metrics.cpuUsagePercent ||
    !metrics.memoryUsagePercent ||
    !metrics.diskUsagePercent
  )
    return 0;

  // Computed weighted utilization
  const weightedUtilization =
    metrics.cpuUsagePercent * WEIGHTED_UTILIZATION_RATIOS.cpu +
    metrics.memoryUsagePercent * WEIGHTED_UTILIZATION_RATIOS.memory +
    metrics.diskUsagePercent * WEIGHTED_UTILIZATION_RATIOS.disk;

  // clamp the waste between 0 and 100
  const waste = Math.max(0, Math.min(100, 100 - weightedUtilization));

  return waste;
}

export function useWithResourceWasteCalculation(data: EC2InstanceTabularData) {
  return data.map((instance) => ({
    ...instance,
    wasteScore: calculateResourceBasedWaste(instance),
  }));
}
