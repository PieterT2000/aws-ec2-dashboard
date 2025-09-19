import { DateRange } from "react-day-picker";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { formatISODateStr } from "@/lib/date-utils";

export const kpiMetricsQueryKeys = {
  all: ["kpi-metrics"],
  byDateRange: (dateRange: DateRange) => [
    ...kpiMetricsQueryKeys.all,
    dateRange,
  ],
};

export function useKPIData({ dateRange }: { dateRange: DateRange }) {
  return useQuery<{
    success: boolean;
    data: {
      dailyBurnRate: {
        avg: number;
        timeseries: { time: string; cost: number }[];
      };
      totalSpend: {
        total: number;
        timeseries: { time: string; cost: number }[];
      };
      projectedMonthlySpend: { avg: number };
    };
  }>({
    queryKey: kpiMetricsQueryKeys.byDateRange(dateRange),
    queryFn: async () => {
      if (!dateRange?.from || !dateRange?.to) {
        throw new Error("Date range is required");
      }
      const response = await axios.get("/api/kpi-metrics", {
        params: {
          startDate: formatISODateStr(dateRange.from),
          endDate: formatISODateStr(dateRange.to),
        },
      });
      if (!response.data.success) {
        throw new Error("Failed to fetch KPI metrics");
      }
      return response.data;
    },
  });
}
