import api from "@/lib/api-factory";
import { useAuthStore } from "@/stores/auth-store";
import { IconLogout } from "@tabler/icons-react";

const LogoutButton = () => {
  const { logout } = useAuthStore();

  const onLogout = async () => {
    try {
      await api.post("/auth/logout");
      logout();
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
