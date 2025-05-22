// @/app/api/auth/refresh/route.ts
import { findUserById } from "@/lib/auth-db-utils";
import { generateTokens, getTokenExpiry } from "@/lib/auth-utils";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  debugger;
  console.log("Attempting to refresh token...");

  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: "No refresh token provided" },
        { status: 401 }
      );
    }

    // Verify and decode the refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as {
      userId: string;
      exp: number; // This is expiration timestamp
    };

    // Check if refresh token has expired
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp < now) {
      return NextResponse.json(
        { error: "Refresh token expired" },
        { status: 401 }
      );
    }

    // Generate new tokens
    const user = await findUserById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    const response = NextResponse.json({
      accessToken,
      user,
    });

    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: getTokenExpiry().accessTokenExpiry,
      path: "/",
    });

    // Optionally rotate refresh token
    if (newRefreshToken) {
      response.cookies.set("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: getTokenExpiry().refreshTokenExpiry,
        path: "/",
      });
    }

    return response;
  } catch (error) {
    const response = NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Token refresh failed",
      },
      { status: 401 }
    );
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }
}
