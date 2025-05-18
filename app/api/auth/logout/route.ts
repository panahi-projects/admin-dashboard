// @/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({ success: true });
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Logout failed" },
      { status: 400 }
    );
  }
}
