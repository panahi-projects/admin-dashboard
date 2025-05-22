"use client";

import { publicRoutes } from "@/configs/public-routes";
import { useAuthStore } from "@/stores/auth-store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, loading, verifyToken, logout } =
    useAuthStore();
  const [initialCheckComplete, setInitialCheckComplete] = useState(false);

  // 👇 Prevent multiple logouts on re-renders
  const hasCheckedAuthRef = useRef(false);

  useEffect(() => {
    const checkAuth = async () => {
      // ✅ This block only runs once
      if (hasCheckedAuthRef.current) return;
      hasCheckedAuthRef.current = true;

      const store = useAuthStore.getState();

      // 🛑 If Zustand thinks we're not authenticated
      if (store.isAuthenticated) {
        try {
          await verifyToken(); // try to validate cookies (e.g., /auth/me)
        } catch (error) {
          await logout(); // cookies expired or invalid → clear client-side auth
        }
      }

      setInitialCheckComplete(true);
    };

    checkAuth();

    const interval = setInterval(
      () => {
        verifyToken().catch(() => logout()); // Periodic re-verification
      },
      1 * 60 * 1000
    );

    return () => clearInterval(interval);
  }, [verifyToken, logout]);

  // 🚦Redirect Logic (after initial check only)
  useEffect(() => {
    if (!initialCheckComplete) return;

    const publicPaths = publicRoutes.map((route) => route.path);
    const isPublicPath = publicPaths.some(
      (publicPath) => pathName === publicPath || pathName.startsWith(publicPath)
    );

    if (isAuthenticated && pathName.startsWith("/auth")) {
      router.push("/dashboard");
    } else if (!isAuthenticated && !isPublicPath) {
      router.replace(`/auth/login?redirect=${encodeURIComponent(pathName)}`);
    }
  }, [isAuthenticated, pathName, initialCheckComplete, router]);

  if (loading && !initialCheckComplete) {
    return <div>Loading auth state...</div>;
  }

  return <>{children}</>;
};

export default AuthProvider;
