import { useAuthStore } from "@/stores/auth-store";
import { IconLogout } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const router = useRouter();
  const { logout } = useAuthStore();

  const onLogout = async () => {
    try {
      await logout();
      router.replace("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <div
      onClick={onLogout}
      className="flex items-center space-x-2 p-2 text-sm cursor-pointer"
    >
      <IconLogout />
      <span>Log out</span>
    </div>
  );
};

export default LogoutButton;
