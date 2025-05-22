import dbConnect from "@/lib/db-connect";
import User from "@/models/User";
import { User as UserType } from "@/types";

export const findUserById = async (id: string): Promise<UserType | null> => {
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
