"use client";
import { PieChart, Pie, Cell, Sector, Text, Label, Line } from "recharts";
import {
  PieLabelRenderProps,
  PieSectorDataItem,
} from "recharts/types/polar/Pie";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "@/components/ui/chart";
import { useDateRange } from "@/contexts/DateRangeContext";
import { ErrorState } from "@/components/ui/error-state";
import PieChartSkeleton from "./PieChartSkeleton";
import { COLORS } from "../../const";
import { formatUSDCurrency } from "@/lib/number-formatting";

import WidgetTitle from "@/components/shared/WidgetTitle";
import { useCostBreakdown } from "../../hooks/useCostBreakdownQueries";
import { useMemo } from "react";
import { useGroupByParams } from "../../hooks/useGroupByParams";
import { GroupByDimensionWithTag } from "@/lib/services/types";
import { getLabelFromKey } from "@/lib/string-utils";

const UNACCOUNTED_STROKE_COLOR = "#e4e8ef";
const MIN_ANGLE = 6;

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
}) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="rounded-lg border bg-background p-2 shadow-md">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm text-muted-foreground">
          Cost: ${data.value?.toFixed(2) || "0.00"}
        </p>
      </div>
    );
  }
  return null;
};

const LabelRenderer = (props: PieLabelRenderProps) => {
  return (
    <Text
      {...props}
      textAnchor={props.textAnchor as "start" | "end" | "middle"}
    >
      {formatUSDCurrency(props.payload?.value)}
    </Text>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LabelLineRenderer = (props: any) => {
  const isUnAccountedCostSector = props.name.includes("Unaccounted");
  return (
    <Line
      {...props}
      stroke={isUnAccountedCostSector ? "black" : props.stroke}
      isAnimationActive={false}
      dot={false}
    />
  );
};

const TotalCostPieChart = () => {
  const { dateRange } = useDateRange();

  const { groupByDimension, tag } = useGroupByParams();
  const isTagKeySelected = tag !== undefined;
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

  const { chartData, chartConfig } = useMemo(() => {
    if (!costData) return { chartData: [], chartConfig: {} };
    const chartData = Object.entries(costData.data.groupedCosts)
      .map(([key, value]) => ({
        name: getLabelFromKey(key, isTagKeySelected),
        value: value.statistics.totalCost || 0,
      }))
      .filter(
        (item) =>
          item.name.toLowerCase() !== "noresourceid" &&
          item.name.toLowerCase() !== "noinstancetype"
      );

    const unaccountedCost = costData.data.totalCost
      ? costData.data.totalCost -
        chartData.reduce((acc, item) => acc + item.value, 0)
      : 0;

    if (unaccountedCost > 0) {
      chartData.push({
        name: "Unaccounted Cost",
        value: unaccountedCost,
      });
    }

    const chartConfig = {
      ...chartData.reduce((acc, item, idx) => {
        acc[item.name] = {
          color: item.name.includes("Unaccounted")
            ? UNACCOUNTED_STROKE_COLOR
            : COLORS[idx % COLORS.length],
          label: item.name,
        };
        return acc;
      }, {} as ChartConfig),
    };
    return { chartData, chartConfig };
  }, [costData, isTagKeySelected]);

  // Check if there's any meaningful cost data
  const hasValidData =
    chartData &&
    chartData.length > 0 &&
    chartData.some((item) => item.value > 0);

  const totalCost = costData?.data.totalCost;

  if (isLoading) {
    return <PieChartSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load cost data"
        message={
          error instanceof Error
            ? error.message
            : "Unable to fetch cost breakdown data. Please try again."
        }
        className="h-80"
      />
    );
  }

  if (!hasValidData) {
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
      <WidgetTitle>Total Costs Breakdown:</WidgetTitle>

      <ChartContainer config={chartConfig} className="w-full">
        <PieChart className="size-80">
          <defs>
            <pattern
              id="diagonal"
              patternUnits="userSpaceOnUse"
              width="8"
              height="8"
            >
              <image href="/diagonal.png" width="8" height="8" x="0" y="0" />
            </pattern>
          </defs>
          <Pie
            minAngle={MIN_ANGLE}
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={"50%"}
            label={LabelRenderer}
            labelLine={LabelLineRenderer}
            isAnimationActive={false}
            activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
              <g>
                <Sector {...props} outerRadius={outerRadius + 5} />
              </g>
            )}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.name.includes("Unaccounted")
                    ? "url(#diagonal)"
                    : COLORS[index % COLORS.length]
                }
                stroke={
                  entry.name.includes("Unaccounted")
                    ? UNACCOUNTED_STROKE_COLOR
                    : COLORS[index % COLORS.length]
                }
              />
            ))}
            {totalCost && (
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-lg font-semibold"
                        >
                          {formatUSDCurrency(totalCost)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Cost
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            )}
          </Pie>
          <ChartTooltip content={<CustomTooltip />} />
          <ChartLegend content={<ChartLegendContent />} />
        </PieChart>
      </ChartContainer>
    </div>
  );
};

export default TotalCostPieChart;
