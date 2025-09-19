import { NextResponse } from "next/server";
import { getEC2InstanceTabularData } from "@/lib/services/ec2";

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

    const data = await getEC2InstanceTabularData(startDate, endDate);

    if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
      const data = await import("./mocks/ec2-instances.json");
      return NextResponse.json({
        success: true,
        data: data.default.data,
      });
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unknown error occurred while fetching instances",
        code: "FETCH_INSTANCES_ERROR",
      },
      { status: 500 }
    );
  }
}
