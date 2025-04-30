"use client";

import { IconInnerShadowTop } from "@tabler/icons-react";
import * as React from "react";

import NavDocuments from "@/components/nav-documents";
import NavMain from "@/components/nav-main";
import NavSecondary from "@/components/nav-secondary";
import NavUser from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import sidebarData from "@/configs/sidebar";
import globalConfigs from "@/configs/global";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible={sidebarData.sidebarDetails?.collapsible} {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">
                  {globalConfigs.main?.title}
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarData.navItems.navMain} />
        <NavDocuments items={sidebarData.navItems.navDocuments} />
        <NavSecondary
          items={sidebarData.navItems.navSecondary}
          className="mt-auto"
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
