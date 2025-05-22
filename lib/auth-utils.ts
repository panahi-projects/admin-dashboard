import {
  TokenExpiry,
  TokenExpiryExtractFormat,
  TokenExpiryFormat,
  TokenExpiryUnit,
  User as UserType,
} from "@/types";
import jwt from "jsonwebtoken";

export const generateTokens = (user: UserType) => {
  // Explicitly type the expiresIn values as strings
  const AccessTokenExpiresIn: TokenExpiryFormat =
    (process.env.ACCESS_TOKEN_EXPIRES_IN as TokenExpiryFormat) || "15m";
  const RefreshTokenExpiresIn: TokenExpiryFormat =
    (process.env.REFRESH_TOKEN_EXPIRES_IN as TokenExpiryFormat) || "7d";

  const accessToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: AccessTokenExpiresIn }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: RefreshTokenExpiresIn }
  );

  return { accessToken, refreshToken };
};

type TokenPayload = { exp?: number } | null;
export const isTokenValid = (token: string): boolean => {
  try {
    const [, payload] = token.split(".");
    if (!payload) return false;

    const decoded = JSON.parse(atob(payload)) as TokenPayload;

    if (!decoded?.exp) return false;

    const now = Math.floor(Date.now() / 1000);
    return decoded.exp > now;
  } catch {
    return false;
  }
};

const DEFAULT_EXPIRY: TokenExpiryExtractFormat = {
  value: 15,
  unit: "m",
};

/**
 * Extracts the numeric value and time unit from a token expiry string.
 * Example: "15m" → { value: 15, unit: "m" }
 */
export const tokenExpiryExtract = (str?: string): TokenExpiryExtractFormat => {
  if (!str) return DEFAULT_EXPIRY;

  const match = str.match(/^(?<value>\d+)(?<unit>[smhd])$/);
  if (!match || !match.groups) return DEFAULT_EXPIRY;

  return {
    value: Number(match.groups.value),
    unit: match.groups.unit as TokenExpiryUnit,
  };
};
/**
 * Converts time to seconds based on the unit.
 */
export const convertToSeconds = ({
  value,
  unit,
}: TokenExpiryExtractFormat): number => {
  const unitMap: Record<TokenExpiryUnit, number> = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 60 * 60 * 24,
  };
  return value * unitMap[unit];
};

/**
 * Returns token expiry durations in seconds.
 */
export const getTokenExpiry = (): TokenExpiry => {
  const accessTokenExpiryRaw = process.env.ACCESS_TOKEN_EXPIRES_IN;
  const refreshTokenExpiryRaw = process.env.REFRESH_TOKEN_EXPIRES_IN;

  const accessTokenObj = tokenExpiryExtract(accessTokenExpiryRaw);
  const refreshTokenObj = tokenExpiryExtract(refreshTokenExpiryRaw);

  return {
    accessTokenExpiry: convertToSeconds(accessTokenObj),
    refreshTokenExpiry: convertToSeconds(refreshTokenObj),
  };
};
