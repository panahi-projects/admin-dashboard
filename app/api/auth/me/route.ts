// @/app/api/auth/me/route.ts
import { findUserById } from "@/lib/auth-db-utils";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    console.log("+ Access Token: ", accessToken);

    if (!accessToken) {
      return NextResponse.json(
        { error: "No access token provided" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET!) as {
      userId: string;
    };

    const user = await findUserById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Authentication failed",
      },
      { status: 401 }
    );
  }
}
