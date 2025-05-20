// Example for login route
import { generateTokens } from "@/lib/auth-utils";
import dbConnect from "@/lib/db-connect";
import User from "@/models/User";
import { extractNumber } from "@/utils";
import { LoginSchema } from "@/validations/auth-schema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();
    const validatedData = LoginSchema.parse(body);

    const user = await User.findOne({ email: validatedData.email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isMatch = await user.comparePassword(validatedData.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const { accessToken, refreshToken } = generateTokens({
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      role: user.role,
    });

    const response = NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });

    const AccessTokenExpiresIn: number = extractNumber(
      process.env.ACCESS_TOKEN_EXPIRES_IN || "15m"
    );
    const RefreshTokenExpiresIn: number = extractNumber(
      process.env.REFRESH_TOKEN_EXPIRES_IN || "7d"
    );

    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * AccessTokenExpiresIn,
      path: "/",
    });

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * RefreshTokenExpiresIn,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Login failed" },
      { status: 400 }
    );
  }
}
