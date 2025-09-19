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
import { useCostSavings } from "@/app/features/ec2-instances/hooks/queries/useCostSavings";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};

export function NavSidebar() {
  const { data } = useCostSavings();
  const recommendationCount = data?.data?.recommendations?.length ?? 0;
  return (
    <SidebarRoot className="min-w-64 bg-white dark:bg-gray-900 pt-2">
      <SidebarContent className="space-y-6">
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => scrollToSection("overview")}>
                <LineChart className="h-5 w-5" />
                Overview
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => scrollToSection("ec2-instances")}
              >
                <Server className="h-5 w-5" />
                EC2 Instances
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuBadge className="bg-primary">
                      {recommendationCount}
                    </SidebarMenuBadge>
                  </TooltipTrigger>
                  <TooltipContent>
                    {recommendationCount} recommendations
                  </TooltipContent>
                </Tooltip>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => scrollToSection("cost-breakdown")}
              >
                <PieChart className="h-5 w-5" />
                Cost Breakdown
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
