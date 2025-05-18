"use client";

import { useAuthStore } from "@/stores/auth-store";
import { useEffect } from "react";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // const router = useRouter();
  // const pathname = usePathname();

  // const redirect = encodeURIComponent(pathname);
  // router.replace(`/auth/login?redirect=${redirect}`);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    console.log("+ AuthProvider isAuthenticated:", isAuthenticated);
  }, [isAuthenticated]);

  return <>{children}</>;
};

export default AuthProvider;
