"use client";

import { XAxis, YAxis, AreaChart, Area } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useCostBreakdown } from "../../hooks/useCostBreakdownQueries";
import { useDateRange } from "@/contexts/DateRangeContext";
import { useCostBreakdownFilters } from "@/contexts/CostBreakdownContext";
import { ErrorState } from "@/components/ui/error-state";
import CostTimeSeriesSkeleton from "./CostTimeSeriesSkeleton";
import { formatUSDCurrency } from "@/lib/number-formatting";
import { useMemo } from "react";
import { COLORS } from "../../const";
import { formatDateAsDayMonth } from "@/lib/date-utils";
import WidgetTitle from "@/components/shared/WidgetTitle";
import { useGroupByParams } from "../../hooks/useGroupByParams";
import { getLabelFromKey } from "@/lib/string-utils";

const CostTimeSeriesChart = () => {
  const { dateRange } = useDateRange();

  const { groupByDimension, tag } = useGroupByParams();
  const {
    data: costData,
    isLoading,
    isError,
    error,
  } = useCostBreakdown({
    dateRange,
    groupByDimension,
    tag,
  });

  const keys = Array.from(
    new Set(Object.keys(costData?.data.groupedCosts || {}))
  ).filter(
    (key) =>
      key.toLowerCase() !== "noresourceid" &&
      key.toLowerCase() !== "noinstancetype"
  );

  // Transform the data for the bar chart
  const { chartData, chartConfig } = useMemo(() => {
    if (!costData?.data) return { chartData: [], chartConfig: {} };
    const costItems = Object.entries(costData.data.groupedCosts).flatMap(
      ([key, value]) => {
        return value.costs.map((item) => ({
          id: key,
          cost: item.cost.Amount,
          time: item.time,
        }));
      }
    );
    const costItemsGroupedByTime = Object.groupBy(
      costItems,
      (item) => item.time
    );
    const chartData = Object.entries(costItemsGroupedByTime).map(
      ([time, items]) => ({
        time: time,
        ...items?.reduce((acc, item) => {
          acc[item.id] = Number(item.cost);
          return acc;
        }, {} as Record<string, number>),
      })
    );

    const chartConfig = keys.reduce((acc, key, idx) => {
      acc[key] = {
        color: COLORS[idx % COLORS.length],
        label: getLabelFromKey(key, tag !== undefined),
      };
      return acc;
    }, {} as ChartConfig);
    return { chartData, chartConfig };
  }, [costData, tag, keys]);

  if (isLoading) {
    return <CostTimeSeriesSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load cost data"
        message={
          error instanceof Error
            ? error.message
            : "Unable to fetch cost time series data. Please try again."
        }
        className="h-80"
      />
    );
  }

  if (chartData.length === 0) {
    return (
      <ErrorState
        title="No cost data available"
        message="No cost information found for the selected date range. Try selecting a different date range."
        className="h-80"
      />
    );
  }

  return (
    <div className="space-y-2">
      <WidgetTitle>Cost Time Series:</WidgetTitle>
      <ChartContainer config={chartConfig} className="size-full">
        <AreaChart data={chartData}>
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={60}
            tickFormatter={formatDateAsDayMonth}
            padding={{ left: 10, right: 10 }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={formatUSDCurrency}
            padding={{ top: 10 }}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          {keys.map((key, index) => (
            <Area
              type="monotone"
              key={key}
              dataKey={key}
              stroke={COLORS[index % COLORS.length]}
              fill={COLORS[index % COLORS.length]}
              stackId="1"
            />
          ))}
          <ChartLegend content={<ChartLegendContent />} />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};

export default CostTimeSeriesChart;
