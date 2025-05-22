// @/app/api/users/route.ts
import { findUserById } from "@/lib/auth-db-utils";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as {
      userId: string;
    };

    const user = await findUserById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // In a real app, you would fetch users from your database
    // This is just a mock example
    const users = [
      { id: "1", username: "user1", email: "user1@example.com" },
      { id: "2", username: "user2", email: "user2@example.com" },
    ];

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Authentication failed",
      },
      { status: 401 }
    );
  }
}
