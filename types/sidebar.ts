import { IconProps } from "@tabler/icons-react";
import { EmailString, RelativeUrl } from "./global";

export type NavItem = {
  title: string;
  url: RelativeUrl;
  icon?: React.ForwardRefExoticComponent<IconProps>;
};

export interface Sidebar {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
}

export type NavKeys = "navMain" | "navSecondary" | "navDocuments";
export interface SidebarUser {
  name: string;
  username: string;
  email?: EmailString;
  avatar?: string;
}

export interface SidebarConfigs {
  user: SidebarUser;
  navItems: Record<NavKeys, NavItem[]>;
  sidebarDetails?: Sidebar;
}
