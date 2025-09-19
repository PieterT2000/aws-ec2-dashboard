"use client";

import KPICard from "./KPICard";
import { useKPIData } from "../hooks/useKPIData";
import { DateRange } from "react-day-picker";
import { useCostSavings } from "../../ec2-instances/hooks/queries/useCostSavings";
import { getDaysInMonth } from "date-fns";
import { useMemo } from "react";

const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
const endDate = new Date();

const KPIDashboard = () => {
  // KPI data is monthly data, so we use the first day of the month as start date and current date as end date as date range
  const { data, isError, isLoading } = useKPIData({
    dateRange: {
      from: startDate,
      to: endDate,
    } as DateRange,
  });
  const { data: costSavingsData } = useCostSavings();
  const absoluteSavings = costSavingsData?.data.totalSavings.absoluteSavings;

  let percentageSavings: number | null =
    costSavingsData && costSavingsData.data.totalSavings.percentageSavings
      ? parseFloat(costSavingsData?.data.totalSavings.percentageSavings)
      : null;
  // if percentageSavings is not a number, calculate it manually
  if (percentageSavings === null || isNaN(percentageSavings)) {
    const totalSpend = data?.data.totalSpend.total;

    percentageSavings =
      totalSpend && absoluteSavings
        ? calculatePercentageChange(totalSpend - absoluteSavings, totalSpend)
        : null;
  }

  const cumulativeMonthlySpendTimeseries =
    data?.data.totalSpend.timeseries?.reduce((acc, curr) => {
      const prev = acc.length > 0 ? acc[acc.length - 1] : 0;
      acc.push(prev + curr.cost);
      return acc;
    }, [] as number[]);

  const projectedMonthlySpendTimeseries = useMemo(() => {
    if (!data?.data.dailyBurnRate || !cumulativeMonthlySpendTimeseries)
      return [];

    const daysInCurrMonth = getDaysInMonth(new Date());
    const currDate = new Date().getDate();
    const projectedDayCount = daysInCurrMonth - currDate + 1;
    const lastCumulativeSpendValue = cumulativeMonthlySpendTimeseries?.at(-1);
    const projectedMonthlySpend = Array.from({
      length: projectedDayCount,
    }).reduce((acc: number[]) => {
      const prev = acc.length > 0 ? acc.at(-1) : lastCumulativeSpendValue;
      acc.push((prev ?? 0) + data?.data.dailyBurnRate.avg);
      return acc;
    }, [] as number[]);
    return projectedMonthlySpend;
  }, [data?.data, cumulativeMonthlySpendTimeseries]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-6">
      <KPICard
        title="Total Monthly Spend"
        subtitle="(cumulative)"
        value={data?.data.totalSpend.total}
        actualData={cumulativeMonthlySpendTimeseries}
        isLoading={isLoading}
        isError={isError}
      />

      <KPICard
        title="Daily Burn Rate"
        subtitle="(avg)"
        value={data?.data.dailyBurnRate.avg}
        actualData={data?.data.dailyBurnRate.timeseries?.map(
          (item) => item.cost
        )}
        isError={isError}
        isLoading={isLoading}
      />

      <KPICard
        title="Projected Monthly Spend"
        subtitle="(cumulative)"
        value={data?.data.projectedMonthlySpend.avg}
        actualData={cumulativeMonthlySpendTimeseries}
        projectedData={projectedMonthlySpendTimeseries}
        isLoading={isLoading}
        isError={isError}
      />
      <KPICard
        title="Potential Monthly Savings"
        value={costSavingsData?.data.totalSavings.absoluteSavings}
        percentageChange={percentageSavings ?? undefined}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
};

export default KPIDashboard;

function calculatePercentageChange(current: number, previous: number) {
  return (current - previous) / previous;
}
