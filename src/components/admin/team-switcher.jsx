"use client";

import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCarRear } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

export function TeamSwitcher({ teams }) {
  const { isMobile } = useSidebar();
  const router = useRouter();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="p-2 bg-cyan-sky text-sky-50 text-xl group-data-[collapsible=icon]:p-1 group-data-[collapsible=icon]:text-lg rounded-md">
                <FontAwesomeIcon icon={faCarRear} />
              </div>
              <h3 className="font-semibold">Admin</h3>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Menu Utama Go - Rent
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => router.push(team.href)}
                className="gap-2 p-2"
              >
                {team.title}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
