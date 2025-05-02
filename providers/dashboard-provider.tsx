"use client";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const DashboardProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/login"); // Client-side fallback
    }
  }, [isAuthenticated]);
  return <>{children}</>;
};

export default DashboardProvider;
