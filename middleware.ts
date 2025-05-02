import { handleAliasRoutes } from "@/middlewares/alias-route-handler";
import { handleProtectedRoutes } from "@/middlewares/protect-route-handler";
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // 1. First handle alias routes
  const aliasResponse: NextResponse<unknown> | undefined =
    handleAliasRoutes(request);
  if (aliasResponse) return aliasResponse;

  // 2. Then handle protected routes
  const protectedResponse: NextResponse<unknown> | null =
    handleProtectedRoutes(request);
  if (protectedResponse) return protectedResponse;

  // 3. Continue if no redirects needed
  return NextResponse.next();
}

// Optionally configure matcher if you want to limit middleware runs
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, etc.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
