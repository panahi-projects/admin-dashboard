"use client";

import { useAuthStore } from "@/stores/auth-store";
import { useEffect } from "react";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading, verifyToken } = useAuthStore();

  useEffect(() => {
    verifyToken();
  }, []);

  if (loading) return <div>Loading auth state...</div>;
  useEffect(() => {
    console.log("+ AuthProvider isAuthenticated:", isAuthenticated);
  }, [isAuthenticated]);

  return <>{children}</>;
};

export default AuthProvider;
