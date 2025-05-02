import { publicRoutes } from "@/configs/public-routes";
import { NextRequest, NextResponse } from "next/server";

const ALIAS_ROUTES = new Map<string, string>();
publicRoutes.forEach((route) => {
  route.aliases.forEach((alias) => {
    ALIAS_ROUTES.set(alias, route.path);
  });
});

export const handleAliasRoutes = (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  const normalizedPath =
    pathname.endsWith("/") && pathname !== "/"
      ? pathname.slice(0, -1)
      : pathname;

  const targetPath = ALIAS_ROUTES.get(normalizedPath);
  if (targetPath) {
    const newUrl = request.nextUrl.clone();
    newUrl.pathname = targetPath;
    return NextResponse.redirect(newUrl);
  }
};
