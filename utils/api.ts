import { RequestInterceptor } from "@/types/global";

let interceptors: RequestInterceptor[] = [];

export function registerInterceptor(interceptor: RequestInterceptor) {
  interceptors.push(interceptor);
  return () => {
    interceptors = interceptors.filter((i) => i !== interceptor);
  };
}

export function unregisterInterceptor(interceptor: RequestInterceptor) {
  interceptors = interceptors.filter((i) => i !== interceptor);
}

let responseInterceptors: ((response: Response) => Promise<Response>)[] = [];

export function registerResponseInterceptor(
  interceptor: (response: Response) => Promise<Response>
) {
  responseInterceptors.push(interceptor);
  return () => {
    responseInterceptors = responseInterceptors.filter(
      (i) => i !== interceptor
    );
  };
}

export function unregisterResponseInterceptor(
  interceptor: (response: Response) => Promise<Response>
) {
  responseInterceptors = responseInterceptors.filter((i) => i !== interceptor);
}

export async function validateToken(token: string): Promise<boolean> {
  // Implement your actual validation logic, e.g.:
  // 1. JWT expiration check (client-side)
  // 2. API call to `/auth/validate` (server-side)
  try {
    const response = await fetch("/api/auth/validate", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.ok;
  } catch {
    return false;
  }
}

export const checkTokenValidity = async (
  token: string | null,
  clearAuth: () => void
) => {
  if (!token) return;

  // Client-side check first (no API call)
  const { exp } = JSON.parse(atob(token.split(".")[1]));
  if (exp * 1000 < Date.now()) {
    clearAuth();
    return;
  }

  // Full server validation every 5min
  if (!(await validateToken(token))) {
    clearAuth();
    window.location.href = "/auth/login"; // Hard redirect
  }
};
