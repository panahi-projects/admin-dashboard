// @/stores/auth-store.ts
import api from "@/lib/api-factory";
import { AuthActions, AuthResponse, AuthState, User } from "@/types";
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
      logout: async () => {
        set({ ...initialState });
        await api.post("/auth/logout");
      },
      setLoading: (loading: boolean) => set({ loading }),
      setError: (error: string | null) => set({ error }),
      setUser: (user: User) => set({ user }),
      setToken: (token: string) => set({ token }),
      verifyToken: async () => {
        set({ loading: true });
        try {
          const res = await api.get<AuthState>("/auth/me"); // or `/auth/verify`
          set({ isAuthenticated: true, user: res.data.user });
        } catch (err) {
          set({ isAuthenticated: false, user: null });
          throw err;
        } finally {
          set({ loading: false });
        }
      },
      refreshToken: async () => {
        set({ loading: true });
        try {
          const res =
            await api.post<AuthResponse<"refreshToken">>("/api/auth/refresh");
          if (res.status !== 200) throw new Error("Unauthorized");

          set({
            isAuthenticated: true,
            user: res.data.user,
          });
        } catch (err) {
          set({ isAuthenticated: false, user: null });
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
