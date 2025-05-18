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

export const generateTokens = (user: UserData) => {
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "7d" }
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
