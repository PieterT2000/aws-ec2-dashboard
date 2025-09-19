import { NextResponse } from "next/server";
import { getEC2Instances } from "@/lib/services/ec2";
import {
  getEC2CostTimeSeriesWithStats,
  getTotalCost,
} from "@/lib/services/cost-explorer";
import {
  GroupByDimension,
  TagKey,
  VALID_GROUP_BY_DIMENSIONS,
  VALID_TAG_KEYS,
} from "@/lib/services/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = (searchParams.get("tag") ?? undefined) as TagKey | undefined;
    const groupByDimension = (searchParams.get("groupByDimension") ??
      undefined) as GroupByDimension | undefined;
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

    // Validate tag parameter
    if (tag && !VALID_TAG_KEYS.includes(tag)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid tag parameter. Must be one of: ${VALID_TAG_KEYS.join(
            ", "
          )}`,
          code: "INVALID_TAG_PARAMETER",
        },
        { status: 400 }
      );
    }

    // Validate groupByDimension parameter
    if (
      groupByDimension &&
      !VALID_GROUP_BY_DIMENSIONS.includes(groupByDimension)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid groupByDimension parameter. Must be one of: ${VALID_GROUP_BY_DIMENSIONS.join(
            ", "
          )}`,
          code: "INVALID_GROUP_BY_DIMENSION_PARAMETER",
        },
        { status: 400 }
      );
    }

    const instances = await getEC2Instances();
    const instanceIds =
      instances
        ?.map((instance) => instance.id)
        .filter((id) => id !== undefined) || [];

    const costData = await getEC2CostTimeSeriesWithStats(
      instanceIds,
      { startDate, endDate },
      groupByDimension,
      tag
    );

    const startDateStr = startDate.split("T")[0];
    const endDateStr = endDate.split("T")[0];

    const totalCost = await getTotalCost({
      startDate: startDateStr,
      endDate: endDateStr,
    });

    return NextResponse.json({
      success: true,
      data: {
        totalCost,
        groupedCosts: costData,
      },
      groupByDimension: groupByDimension,
      tag: tag,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unknown error occurred while fetching EC2 costs",
        code: "FETCH_COSTS_ERROR",
      },
      { status: 500 }
    );
  }
}
