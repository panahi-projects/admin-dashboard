"use client";

import { LoadingSpinner } from "@/components/dashboard/loading-spinner";
import { publicRoutes } from "@/configs/public-routes";
import { useAuthStore } from "@/stores/auth-store";
import {
  checkTokenValidity,
  registerInterceptor,
  unregisterInterceptor,
} from "@/utils/api";
import { useEffect, useState } from "react";

const publicPaths = publicRoutes.map((route) => route.path); // Add your public routes here

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { token, isAuthenticated, isLoading, clearAuth } = useAuthStore();
  const [isClientReady, setIsClientReady] = useState(false);

  useEffect(() => {
    //1. Check validation logic, Run immediately on mount and every 5 minutes
    checkTokenValidity(token, clearAuth);
    const interval = setInterval(() => {
      checkTokenValidity(token, clearAuth);
    }, 300_000); // 5 mins

    // 2. Attach token to API requests
    const requestInterceptor = (url: string, config: RequestInit) => {
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
      return { url, config };
    };

    registerInterceptor(requestInterceptor);

    // Mark client-side as ready after initial check
    setIsClientReady(true);

    return () => {
      clearInterval(interval); // Clear interval on unmount
      unregisterInterceptor(requestInterceptor);
      // Clear auth state if token is not present and user is not authenticated
    };
  }, [token]);

  // Show spinner only during initial client-side hydration
  if (isLoading || !isClientReady) {
    return <LoadingSpinner fullScreen />;
  }

  return <>{children}</>;
};
