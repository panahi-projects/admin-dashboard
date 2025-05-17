// ./stores/auth-store.tsx
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AuthState = {
  token: string | null;
  refreshToken: string | null | undefined;
  user: any | null;
  isAuthenticated: boolean;
  error: string | null;
  isLoading: boolean;
};

type AuthActions = {
  setAuth: (token: string, refreshToken: string, user: any) => void;
  setToken: (token: string) => void;
  setUser: (user: any) => void;
  clearAuth: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  refreshToken: null,
  error: null,
  isLoading: false,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      ...initialState,
      setAuth: (token, refreshToken, user) =>
        set({ token, refreshToken, user, isAuthenticated: true }),
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      clearAuth: () => set(initialState),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage), // Use sessionStorage instead of localStorage
    }
  )
);
