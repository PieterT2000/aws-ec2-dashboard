import { EC2CostTimeSeriesWithStatsData } from "@/lib/services/cost-explorer";
import { GroupByDimension, TagKey } from "@/lib/services/types";
import { formatISODateStr } from "@/lib/date-utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DateRange } from "react-day-picker";

export const costBreakdownQueryKeys = {
  all: ["cost-breakdown"],
  byDateRange: (
    dateRange: DateRange | undefined,
    groupByDimension?: GroupByDimension,
    tag?: TagKey
  ) => [...costBreakdownQueryKeys.all, dateRange, groupByDimension, tag],
  tags: () => [...costBreakdownQueryKeys.all, "tags"],
};

export function useCostBreakdown({
  dateRange,
  groupByDimension,
  tag,
}: {
  dateRange: DateRange | undefined;
  groupByDimension?: GroupByDimension;
  tag?: TagKey;
}) {
  return useQuery<{
    success: boolean;
    data: {
      totalCost?: number;
      groupedCosts: EC2CostTimeSeriesWithStatsData;
    };
    tag?: TagKey;
    groupByDimension?: GroupByDimension;
  }>({
    queryKey: costBreakdownQueryKeys.byDateRange(
      dateRange,
      groupByDimension,
      tag
    ),
    queryFn: async () => {
      if (!dateRange?.from || !dateRange?.to) {
        throw new Error("Date range is required");
      }

      const response = await axios.get("/api/ec2-costs", {
        params: {
          startDate: formatISODateStr(dateRange.from),
          endDate: formatISODateStr(dateRange.to),
          groupByDimension: groupByDimension,
          tag: tag,
        },
      });
      if (!response.data.success) {
        throw new Error("Failed to fetch cost breakdown");
      }
      return response.data;
    },
  });
}

export function useEC2TagKeys() {
  return useQuery({
    queryKey: costBreakdownQueryKeys.tags(),
    queryFn: async () => {
      const response = await axios.get("/api/ec2-tags");

      if (!response.data.success) {
        throw new Error("Failed to fetch EC2 tag keys");
      }

      return response.data.data as string[];
    },
  });
}
