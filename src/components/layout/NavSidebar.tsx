"use client";

import React from "react";
import {
  Sidebar as SidebarRoot,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
} from "@/components/ui/sidebar";
import { Server, PieChart, LineChart } from "lucide-react";
import { ThemePicker } from "./ThemePicker";

export function NavSidebar() {
  return (
    <SidebarRoot className="min-w-64 bg-white dark:bg-gray-900 pt-2">
      <SidebarContent className="space-y-6">
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Server className="h-5 w-5" />
                EC2 Instances
                <SidebarMenuBadge className="bg-primary">4</SidebarMenuBadge>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <PieChart className="h-5 w-5" />
                Cost Breakdown
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <LineChart className="h-5 w-5" />
                Cost Projection
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="flex items-center justify-start w-full">
                <ThemePicker />
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarFooter>
    </SidebarRoot>
  );
}
