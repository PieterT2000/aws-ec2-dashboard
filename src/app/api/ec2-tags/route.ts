import { NextResponse } from "next/server";
import { getAvailableTagKeys } from "@/lib/services/ec2-tags";

export async function GET() {
  try {
    const data = await getAvailableTagKeys();
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error in EC2 tags API:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
        code: "EC2_TAGS_ERROR",
      },
      { status: 500 }
    );
  }
}
