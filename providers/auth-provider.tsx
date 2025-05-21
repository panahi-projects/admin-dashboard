"use client";

import { publicRoutes } from "@/configs/public-routes";
import { useAuthStore } from "@/stores/auth-store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname();
  const router = useRouter();
  const { isAuthenticated, loading, verifyToken, logout } = useAuthStore();
  const [initialCheckComplete, setInitialCheckComplete] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (!useAuthStore.getState().isAuthenticated) return; // 🛑 Skip check if user is not logged in
      try {
        await verifyToken();
      } catch (error) {
        logout();
      } finally {
        // Mark initial check as complete
        if (!initialCheckComplete) {
          setInitialCheckComplete(true);
        }
      }
    };

    checkAuth();

    // Set up periodic token verification (every 5 minutes)
    const interval = setInterval(checkAuth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [verifyToken, logout, initialCheckComplete]);

  // Handle redirects
  useEffect(() => {
    debugger;
    // Only proceed after initial auth check is complete
    if (!initialCheckComplete) return;

    const publicPaths = publicRoutes.map((route) => route.path);
    const isPublicPath = publicPaths.some(
      (publicPath) => pathName === publicPath || pathName.startsWith(publicPath)
    );

    if (isAuthenticated && pathName.startsWith("/auth")) {
      router.push("/dashboard");
    } else if (!isAuthenticated && !isPublicPath) {
      // Use replace instead of push to prevent back navigation to protected page
      router.replace(`/auth/login?redirect=${encodeURIComponent(pathName)}`);
    }
  }, [isAuthenticated, pathName, initialCheckComplete, router]);

  if (loading && !initialCheckComplete) {
    return <div>Loading auth state...</div>;
  }

  return <>{children}</>;
};

export default AuthProvider;
