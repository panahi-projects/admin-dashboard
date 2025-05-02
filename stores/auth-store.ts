import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AuthState = {
  token: string | null;
  refreshToken: string | null;
  user: any | null;
  isAuthenticated: boolean;
  error: string | null;
  isLoading?: boolean;
};

type AuthActions = {
  setToken: (token: string, refreshToken: string) => void;
  setUser: (user: any) => void;
  clearAuth: () => void;
  setLoading: (isLoading: boolean) => void;
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  error: null,
  refreshToken: null,
  isLoading: false,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      ...initialState,
      setToken: (token, refreshToken) =>
        set({ token, refreshToken, isAuthenticated: true }),
      setUser: (user) => set({ user }),
      clearAuth: () => set(initialState),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "auth-storage",
    }
  )
);
