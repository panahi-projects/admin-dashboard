import { publicRoutes } from "@/configs/public-routes";
import api from "@/lib/api-factory";
import { NextRequest, NextResponse } from "next/server";

const publicPaths = publicRoutes.map((route) => route.path);

export const handleProtectedRoutes = (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  // 🛑 Skip middleware for API routes
  if (pathname.startsWith("/api")) {
    return null;
  }

  // 🍪 Read cookies
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // 🛑 Allow public routes and auth pages
  if (publicPaths.includes(pathname) || pathname.startsWith("/auth")) {
    return null;
  }

  // 🔒 If not authenticated, redirect to login page
  if (!accessToken) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ✅ No redirect if authenticated
  return null;
};
