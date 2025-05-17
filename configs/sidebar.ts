import { SidebarConfigs } from "@/types";
import {
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
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
      {
        title: "Lifecycle",
        url: "/dashboard/lifecycle",
        icon: IconListDetails,
      },
      {
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: IconChartBar,
      },
      {
        title: "Projects",
        url: "/dashboard/projects",
        icon: IconFolder,
      },
      {
        title: "Team",
        url: "/dashboard/team",
        icon: IconUsers,
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
        title: "Data Library",
        url: "/dashboard/datalibrary",
        icon: IconDatabase,
      },
      {
        title: "Reports",
        url: "/dashboard/reports",
        icon: IconReport,
      },
      {
        title: "Word Assistant",
        url: "/dashboard",
        icon: IconFileWord,
      },
    ],
  },
  sidebarDetails: {
    collapsible: globalConfigs.sidebar?.collapsible,
  },
};

export default sidebarConfigs;
