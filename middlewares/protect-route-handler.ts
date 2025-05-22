import { publicRoutes } from "@/configs/public-routes";
import { getTokenExpiry, isTokenValid } from "@/lib/auth-utils";
import { NextRequest, NextResponse } from "next/server";

const publicPaths = publicRoutes.map((route) => route.path);
export const handleProtectedRoutes = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  // 🍪 Read cookies
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const isAuthenticated = accessToken && isTokenValid(accessToken);

  if (pathname.startsWith("/api/auth")) {
    // Allow auth-related API endpoints
    return null;
  }

  // 🛑 Skip middleware for API routes
  if (pathname.startsWith("/api")) {
    if (!isAuthenticated && refreshToken) {
      try {
        const refreshResponse = await attemptTokenRefresh(
          request,
          refreshToken
        );
        if (refreshResponse) return refreshResponse;
      } catch (error) {
        console.error("Token refresh failed:", error);
        // Clear cookies and redirect if refresh fails
        const res = NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
        res.cookies.delete("accessToken");
        res.cookies.delete("refreshToken");
        return res;
      }
    }
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    return null;
  }

  // ✅ If authenticated and trying to visit an auth page → redirect to dashboard
  if (pathname.startsWith("/auth") && isAuthenticated) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // 🛑 Allow public routes and auth pages (for unauthenticated users)
  if (publicPaths.includes(pathname) || pathname.startsWith("/auth")) {
    return null;
  }

  // Token refresh logic
  if (!isAuthenticated && refreshToken) {
    console.log("+++ Attempting to refresh token...");

    try {
      const refreshResponse = await attemptTokenRefresh(request, refreshToken);
      if (refreshResponse) return refreshResponse;
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

async function attemptTokenRefresh(request: NextRequest, refreshToken: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
  const refreshUrl = new URL("/api/auth/refresh", baseUrl);

  const response = await fetch(refreshUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `refreshToken=${refreshToken}`,
    },
    credentials: "include",
  });

  if (response.ok) {
    const { accessToken } = await response.json();
    const res = NextResponse.next();

    res.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: getTokenExpiry().accessTokenExpiry,
    });

    return res;
  }

  // If refresh fails, clear invalid tokens
  if (response.status === 401) {
    const res = NextResponse.redirect(new URL("/auth/login", request.url));
    res.cookies.delete("accessToken");
    res.cookies.delete("refreshToken");
    return res;
  }

  return null;
}
