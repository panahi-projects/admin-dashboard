// @/lib/auth-utils.ts
import jwt from "jsonwebtoken";
import User from "@/models/User";
import dbConnect from "@/lib/db-connect";

type UserData = {
  id: string;
  username: string;
  email: string;
  role?: string;
};
type TokenExpiryFormat = `${number}${"s" | "m" | "h" | "d"}`; // e.g., "15m", "1h", "2d"
export const generateTokens = (user: UserData) => {
  // Explicitly type the expiresIn values as strings
  const AccessTokenExpiresIn: TokenExpiryFormat =
    (process.env.ACCESS_TOKEN_EXPIRES_IN as TokenExpiryFormat) || "15m";
  const RefreshTokenExpiresIn: TokenExpiryFormat =
    (process.env.REFRESH_TOKEN_EXPIRES_IN as TokenExpiryFormat) || "7d";

  const accessToken = jwt.sign(
    { userId: user.id, email: user.email },
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

export const findUserById = async (id: string): Promise<UserData | null> => {
  await dbConnect();
  const user = await User.findById(id).select("-password");
  if (!user) return null;
  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    role: user.role,
  };
};
