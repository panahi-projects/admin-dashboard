// @/app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import { SignupSchema } from "@/validations/auth-schema";
import User from "@/models/User";
import { generateTokens } from "@/lib/auth-utils";
import dbConnect from "@/lib/db-connect";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();
    const validatedData = SignupSchema.parse(body);

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: validatedData.email },
        { username: validatedData.username },
      ],
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email or username already exists" },
        { status: 400 }
      );
    }

    const user = new User(validatedData);
    await user.save();

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

    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 15, // 15 minutes
      path: "/",
    });

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Signup failed" },
      { status: 400 }
    );
  }
}
