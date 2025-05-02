"use client";

import { LoadingSpinner } from "@/components/dashboard/loading-spinner";
import { publicRoutes } from "@/configs/public-routes";
import { useAuthStore } from "@/stores/auth-store";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const publicPaths = publicRoutes.map((route) => route.path); // Add your public routes here

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useAuthStore();
  const pathname = usePathname();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Skip auth check for public routes
    if (publicPaths.includes(pathname)) {
      setAuthChecked(true);
      return;
    }

    if (!isLoading) {
      setAuthChecked(true);
    }
  }, [pathname, isLoading]);

  if (isLoading || !authChecked) {
    return <LoadingSpinner fullScreen />;
  }

  return <>{children}</>;
};
