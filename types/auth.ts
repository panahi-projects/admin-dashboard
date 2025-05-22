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
  verifyToken: () => Promise<void>;
};

export type AuthResponse<
  K extends "accessToken" | "refreshToken" = "accessToken",
> = {
  user: User;
} & Record<K, string>;

export type TokenExpiryUnit = "s" | "m" | "h" | "d";
export type TokenExpiryFormat = `${number}${TokenExpiryUnit}`; // e.g., "15m", "1h", "2d"

export interface TokenExpiryExtractFormat {
  value: number;
  unit: TokenExpiryUnit;
}

export interface TokenExpiry {
  accessTokenExpiry: number; // in seconds
  refreshTokenExpiry: number; // in seconds
}
