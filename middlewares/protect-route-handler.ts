import { publicRoutes } from "@/configs/public-routes";
import api from "@/lib/api-factory";
import { isTokenValid } from "@/lib/auth-utils";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

const publicPaths = publicRoutes.map((route) => route.path);

export const handleProtectedRoutes = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  // 🍪 Read cookies
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  console.log("Access token:", accessToken);
  console.log("Refresh token:", refreshToken);

  const isAuthenticated = accessToken && isTokenValid(accessToken);

  // 🛑 Skip middleware for API routes
  if (pathname.startsWith("/api")) {
    return null;
  }

  // 🛑 Allow public routes and auth pages
  if (publicPaths.includes(pathname)) {
    return null;
  }

  // ✅ If user is authenticated and trying to visit /auth routes → redirect to /dashboard
  if (pathname.startsWith("/auth") && isAuthenticated) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // 🔄 Try to refresh token if accessToken is missing but refreshToken exists
  if (refreshToken) {
    console.log("Trying to refresh token...");

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
      const response = await fetch(`${baseUrl}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const { accessToken: newAccessToken } = await response.json();

        const res = NextResponse.next();
        // ✅ Set the new token in cookies (adjust path/secure flags as needed)
        res.cookies.set("accessToken", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });

        return res;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
    }
  }

  // 🔒 If trying to access protected routes and not authenticated → redirect to login
  if (!isAuthenticated) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return null; // ✅ Authenticated and not hitting /auth or public, allow through
};
