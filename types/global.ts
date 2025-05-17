import { IconProps } from "@tabler/icons-react";
import { Sidebar } from "./sidebar";

export type AbsoluteUrl = `http${"s" | ""}://${string}`;
export type RelativeUrl = `/${string}`;
export type UrlString = AbsoluteUrl | RelativeUrl;
export type EmailString = `${string}@${string}.${string}`;
export type PhoneString = `+${string}` | `0${string}`;
export type DateString =
  | `${number}-${number}-${number}`
  | `${number}/${number}/${number}`;
export type DateTimeString = `${DateString} ${number}:${number}:${number}`;
export type TimeString =
  | `${number}:${number}:${number}`
  | `${number}:${number}`;

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
