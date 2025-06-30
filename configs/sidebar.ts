import { SidebarConfigs } from "@/types";
import {
  IconDashboard,
  IconHelp,
  IconReport,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react";
import globalConfigs from "./global";

const sidebarConfigs: SidebarConfigs = {
  user: {
    name: "shadcn",
    username: "m@example.com",
    email: "m@example.com",
    avatar: "/assets/images/avatar.jpg",
  },
  navItems: {
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: IconDashboard,
      },
    ],
    navSecondary: [
      {
        title: "Settings",
        url: "/dashboard",
        icon: IconSettings,
      },
      {
        title: "Get Help",
        url: "/dashboard",
        icon: IconHelp,
      },
      {
        title: "Search",
        url: "/dashboard",
        icon: IconSearch,
      },
    ],
    navDocuments: [
      {
        title: "Reports",
        url: "/dashboard/reports",
        icon: IconReport,
      },
    ],
  },
  sidebarDetails: {
    collapsible: globalConfigs.sidebar?.collapsible,
  },
};

export default sidebarConfigs;
