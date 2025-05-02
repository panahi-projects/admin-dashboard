import { publicRoutes } from "@/configs/public-routes";
import { NextRequest, NextResponse } from "next/server";

const publicPaths = publicRoutes.map((route) => route.path);

export const handleProtectedRoutes = (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // Skip protection for public routes
  if (publicPaths.includes(pathname) || pathname.startsWith("/auth")) {
    return null;
  }

  // Redirect to login if not authenticated
  if (!token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect from auth pages to dashboard if authenticated
  if (token && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return null;
};
