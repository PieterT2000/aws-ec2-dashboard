import { costExplorerClient } from "./aws-config";
import {
  Expression,
  GetCostAndUsageCommand,
  GetCostAndUsageCommandInput,
  GetCostAndUsageWithResourcesCommand,
  GetCostAndUsageWithResourcesCommandInput,
  GetCostAndUsageWithResourcesCommandOutput,
  MetricValue,
} from "@aws-sdk/client-cost-explorer";
import { GroupByDimension, TagKey, VALID_TAG_KEYS } from "./types";
import { differenceInDays } from "date-fns";

export async function getTotalCost({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) {
  const params: GetCostAndUsageCommandInput = {
    TimePeriod: { Start: startDate, End: endDate },
    Granularity: "MONTHLY",
    Metrics: ["UnblendedCost"],
    GroupBy: [{ Type: "DIMENSION", Key: "RECORD_TYPE" }],
  };
  const command = new GetCostAndUsageCommand(params);
  const response = await costExplorerClient.send(command);
  const totalCostOverPeriod = response.ResultsByTime?.reduce((acc, curr) => {
    if (!curr.Groups?.length) return acc;
    const usageGroup = curr.Groups.find((group) =>
      group.Keys?.includes("Usage")
    );
    const costStr = usageGroup?.Metrics?.UnblendedCost?.Amount;
    const cost = costStr ? parseFloat(costStr) : 0;
    acc += isNaN(cost) ? 0 : cost;
    return acc;
  }, 0);
  return totalCostOverPeriod;
}

export async function getDailyTimeseriesCost({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) {
  const params: GetCostAndUsageCommandInput = {
    TimePeriod: { Start: startDate, End: endDate },
    Granularity: "DAILY",
    Metrics: ["UnblendedCost"],
    GroupBy: [{ Type: "DIMENSION", Key: "RECORD_TYPE" }],
  };
  const command = new GetCostAndUsageCommand(params);
  const response = await costExplorerClient.send(command);
  const periodInDays = differenceInDays(new Date(endDate), new Date(startDate));
  // return timeseries grouped by time
  const timeseries = response.ResultsByTime?.map((result) => {
    const usageGroup = result.Groups?.find((group) =>
      group.Keys?.includes("Usage")
    );
    const costStr = usageGroup?.Metrics?.UnblendedCost?.Amount;
    const cost = costStr ? parseFloat(costStr) : 0;
    return {
      time: result.TimePeriod?.Start,
      cost,
    };
  });

  const totalCost = timeseries?.reduce((acc, curr) => {
    acc += curr.cost;
    return acc;
  }, 0);
  return {
    timeseries,
    avgDailyCost: totalCost ? totalCost / (periodInDays || 1) : 0,
  };
}

async function getEC2Costs(
  instanceIds: string[],
  { startDate, endDate }: { startDate: string; endDate: string },
  groupBy: GroupByDimension = "RESOURCE_ID",
  tagKey?: undefined | TagKey
) {
  if (!instanceIds || instanceIds.length === 0) {
    return {};
  }

  try {
    const serviceFilter: Expression = {
      Dimensions: {
        Key: "SERVICE",
        Values: ["Amazon Elastic Compute Cloud - Compute"],
      },
    };
    const resourceFilter: Expression = {
      Dimensions: {
        Key: "RESOURCE_ID",
        Values: [...instanceIds, "NoResourceId"],
      },
    };

    const params: GetCostAndUsageWithResourcesCommandInput = {
      TimePeriod: {
        Start: startDate,
        End: endDate,
      },
      Granularity: "HOURLY",
      Metrics: ["UNBLENDED_COST"],
      Filter: serviceFilter,
      GroupBy: [{ Type: "DIMENSION", Key: groupBy }],
    };
    if (groupBy !== "RESOURCE_ID") {
      params.Filter = {
        And: [serviceFilter, resourceFilter],
      };
    }
    if (tagKey && VALID_TAG_KEYS.includes(tagKey)) {
      params.GroupBy = [{ Type: "TAG", Key: tagKey }];
      params.Filter = {
        And: [serviceFilter, resourceFilter],
      };
    }

    const command = new GetCostAndUsageWithResourcesCommand(params);
    const response = await costExplorerClient.send(command);

    const groupedCosts = groupCostsBy1stGroupKey(response);

    return groupedCosts;
  } catch (error) {
    console.error("Error fetching and computing EC2 costs stats:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to fetch EC2 instance hourly costs"
    );
  }
}

export async function getEC2CostTimeSeriesWithStats(
  ...args: Parameters<typeof getEC2Costs>
) {
  const groupedCosts = (await getEC2Costs(...args)) || {};
  const groupedCostStats = calculateCostStats(groupedCosts);
  return Object.fromEntries(
    Object.entries(groupedCostStats).map(([key, value]) => [
      key,
      {
        statistics: value,
        costs: groupedCosts[key],
      },
    ])
  );
}
export type EC2CostTimeSeriesWithStatsData = Awaited<
  ReturnType<typeof getEC2CostTimeSeriesWithStats>
>;

export async function getEC2CostStats(...args: Parameters<typeof getEC2Costs>) {
  const groupedCosts = (await getEC2Costs(...args)) || {};
  return calculateCostStats(groupedCosts);
}

function groupCostsBy1stGroupKey(
  costs: GetCostAndUsageWithResourcesCommandOutput
) {
  const groupedCosts = costs.ResultsByTime?.reduce((acc, curr) => {
    if (!curr.Groups?.length) return acc;
    for (const group of curr.Groups) {
      const groupKey = group.Keys?.[0];
      if (!groupKey || !curr.TimePeriod?.Start || !group.Metrics?.UnblendedCost)
        continue;
      acc[groupKey] = (acc[groupKey] || []).concat({
        cost: group.Metrics.UnblendedCost,
        time: curr.TimePeriod.Start,
      });
    }

    return acc;
  }, {} as Record<string, { cost: MetricValue; time: string }[]>);
  return groupedCosts;
}

/**
 * Calculate the total and average cost per instance. Stats will be computed over hourly data
 * @param costs
 */
function calculateCostStats(costs: ReturnType<typeof groupCostsBy1stGroupKey>) {
  return Object.entries(costs || {}).reduce((acc, [groupKey, costs]) => {
    const parsedCosts = costs
      .filter((cost) => cost.cost.Amount && cost.cost.Amount !== "0")
      .map((cost) => parseFloat(cost.cost.Amount!))
      .filter((cost) => !isNaN(cost));
    const totalCost = parsedCosts.reduce((acc, curr) => acc + curr, 0);
    const avgCost = totalCost / parsedCosts.length;
    acc[groupKey] = {
      totalCost,
      avgCost,
    };
    return acc;
  }, {} as Record<string, { totalCost: number; avgCost: number }>);
}
