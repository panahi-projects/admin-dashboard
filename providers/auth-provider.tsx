"use client";

import { useAuthStore } from "@/stores/auth-store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname();
  const router = useRouter();
  const { isAuthenticated, loading, verifyToken, logout } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await verifyToken();
      } catch (error) {
        logout();
      }
    };

    checkAuth();

    // Set up periodic token verification (every 5 minutes)
    const interval = setInterval(checkAuth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [verifyToken, logout]);

  // Redirect to dashboard if authenticated and trying to access auth routes
  useEffect(() => {
    if (isAuthenticated && pathName.startsWith("/auth")) {
      router.push("/dashboard");
    }
    if (!isAuthenticated) {
      const publicPaths = ["/auth/login", "/auth/register"];
      if (!publicPaths.includes(pathName)) {
        router.push("/auth/login");
      }
    }
  }, [isAuthenticated]);

  if (loading) return <div>Loading auth state...</div>;

  return <>{children}</>;
};

export default AuthProvider;
