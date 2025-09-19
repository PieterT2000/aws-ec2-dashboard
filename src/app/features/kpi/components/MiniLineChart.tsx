import { Area, Line, ResponsiveContainer, ComposedChart } from "recharts";

interface MiniLineChartProps {
  actualData: number[];
  projectedData?: number[];
  color?: string;
  className?: string;
}

const MiniLineChart = ({
  actualData,
  projectedData,
  color = "#3b82f6",
  className = "w-32 h-14",
}: MiniLineChartProps) => {
  if (!actualData || actualData.length < 2) {
    return null;
  }

  // Combine actual and projected data
  const combinedData = [...actualData];
  if (projectedData && projectedData.length > 0) {
    combinedData.push(...projectedData);
  }

  // Transform data for Recharts
  const chartData = combinedData.map((value, index) => {
    const isProjected = projectedData && index >= actualData.length;

    return {
      index,
      value,
      actual: isProjected ? null : value,
      projected: isProjected ? value : null,
    };
  });

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          {/* Actual values area chart */}
          <Area
            type="monotone"
            dataKey="actual"
            stroke={color}
            fill={color}
            fillOpacity={0.2}
            strokeWidth={2}
            connectNulls={false}
          />
          {/* Projected values line chart */}
          {projectedData && projectedData.length > 0 && (
            <Line
              type="monotone"
              dataKey="projected"
              stroke={color}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              connectNulls={false}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MiniLineChart;
