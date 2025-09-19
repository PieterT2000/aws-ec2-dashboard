import {
  getDailyTimeseriesCost,
  getTotalCost,
} from "@/lib/services/cost-explorer";
import { getDaysInMonth } from "date-fns";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Validate required date parameters
    if (!startDate || !endDate) {
      return NextResponse.json(
        {
          success: false,
          message: "Both startDate and endDate query parameters are required",
          code: "MISSING_DATE_PARAMETERS",
        },
        { status: 400 }
      );
    }

    const startDateStr = startDate.split("T")[0];
    const endDateStr = endDate.split("T")[0];

    const { avgDailyCost, timeseries } = await getDailyTimeseriesCost({
      startDate: startDateStr,
      endDate: endDateStr,
    });
    const totalSpend = await getTotalCost({
      startDate: startDateStr,
      endDate: endDateStr,
    });
    const daysInCurrentMonth = getDaysInMonth(new Date());
    const projectedMonthlySpend = avgDailyCost * daysInCurrentMonth;

    return NextResponse.json({
      success: true,
      data: {
        dailyBurnRate: {
          avg: avgDailyCost,
          timeseries,
        },
        totalSpend: {
          total: totalSpend,
          timeseries,
        },
        projectedMonthlySpend: {
          avg: projectedMonthlySpend,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unknown error occurred while fetching KPI metrics",
        code: "KPI_METRICS_ERROR",
      },
      { status: 500 }
    );
  }
}
