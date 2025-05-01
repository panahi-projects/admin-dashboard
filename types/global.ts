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
    appName: string;
    appDescription: string;
    appVersion: string;
    logo?: RelativeUrl;
    logoIcon?: React.ForwardRefExoticComponent<IconProps>;
    logoDark?: RelativeUrl;
    favIcon?: RelativeUrl;
    appUrl?: UrlString;
    title: string;
    description: string;
    titleTemplate: string;
    keywords?: string[];
  };
  sidebar?: Sidebar;
}
