import { NextResponse } from "next/server";
import { isValidCredential } from "@/lib/services/aws-config";

export async function middleware() {
  try {
    const isValidAwsCredential = await isValidCredential();
    if (!isValidAwsCredential) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid AWS credentials. Please check your environment variables",
          code: "INVALID_CREDENTIALS",
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Middleware auth error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Unable to validate AWS credentials.",
        code: "AUTH_ERROR",
      },
      { status: 500 }
    );
  }
}

export const config = {
  matcher: ["/api/(.*)"],
};
