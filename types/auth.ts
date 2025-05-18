export type User = {
  id: string;
  username: string;
  email: string;
  role?: string;
};

export type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
};

export type AuthActions = {
  login: (token: string, user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setUser: (user: User) => void;
  validateToken?: () => boolean;
};

export type AuthResponse = {
  user: User;
  token: string;
};
