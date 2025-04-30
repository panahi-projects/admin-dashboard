import { IconProps } from "@tabler/icons-react";
import { EmailString, RelativeUrl } from "./global";

export type NavItem = {
  title: string;
  url: RelativeUrl;
  icon?: React.ForwardRefExoticComponent<IconProps>;
};
export type NavKeys = "navMain" | "navSecondary" | "navDocuments";
export interface SidebarUser {
  name: string;
  email: EmailString;
  avatar?: string;
}

export interface SidebarConfigs {
  user: SidebarUser;
  navItems: Record<NavKeys, NavItem[]>;
}
