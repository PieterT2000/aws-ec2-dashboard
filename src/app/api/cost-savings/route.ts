import { NextResponse } from "next/server";
import {
  getCostSavingRecommendations,
  getTotalCostSavings,
} from "@/lib/services/cost-savings";

export async function GET() {
  try {
    const totalSavings = await getTotalCostSavings();

    const recommendations = await getCostSavingRecommendations();

    return NextResponse.json({
      success: true,
      data: {
        recommendations,
        totalSavings,
      },
    });
  } catch (error) {
    console.error("Error in cost savings API:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch cost savings recommendations",
        code: "COST_SAVINGS_ERROR",
      },
      { status: 500 }
    );
  }
}
