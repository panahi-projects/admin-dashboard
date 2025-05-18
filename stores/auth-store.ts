// @/stores/auth-store.ts
import { AuthActions, AuthState, User } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      ...initialState,
      login: (token: string, user: User) =>
        set({ token, user, isAuthenticated: true }),
      logout: () => set({ ...initialState }),
      setLoading: (loading: boolean) => set({ loading }),
      setError: (error: string | null) => set({ error }),
      setUser: (user: User) => set({ user }),
      setToken: (token: string) => set({ token }),
    }),
    {
      name: "auth-storage",
    }
  )
);
