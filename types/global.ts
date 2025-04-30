import { IconProps } from "@tabler/icons-react";

export type AbsoluteUrl = `http${"s" | ""}://${string}`;
export type RelativeUrl = `/${string}`;
export type UrlString = AbsoluteUrl | RelativeUrl;
export type EmailString = `${string}@${string}.${string}`;

export interface Sidebar {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
}
export interface GlobalConfigs {
  main: {
    title: string;
    logoUrl?: RelativeUrl;
    logoIcon?: React.ForwardRefExoticComponent<IconProps>;
  };
  sidebar?: Sidebar;
}
