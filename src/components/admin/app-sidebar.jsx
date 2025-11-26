"use client";

import { NavMain } from "@/components/admin/nav-main";
import { NavProjects } from "@/components/admin/nav-projects";
import { NavUser } from "@/components/admin/nav-user";
import { TeamSwitcher } from "@/components/admin/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import AdminMenu from "../data-menu/admin-menu";
import { useEffect, useState } from "react";
import { getProfileUser } from "@/service/auth.service";
import navigasi from "../layout/navbar/navigasi";
import PetugasMenu from "../data-menu/petugas-menu";
import PelangganMenu from "../data-menu/pelanggan-menu";

export function AppSidebar({ role = "admin", ...props }) {
  const [userData, setUserData] = useState({
    userId: "",
    name: "",
    email: "",
    avatar: "",
    role: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      const res = await getProfileUser();
      if (res.status && res.data) {
        setUserData({
          userId: res.data.profile.id,
          name: res.data.profile.username,
          email: res.data.auth.email,
          avatar: res.data.profile.foto_url,
          role: res.data.profile.role,
        });
      }
      setIsLoading(false);
    };

    getUserData();
  }, []);

  const menu = () => {
    if (role === "admin") {
      return AdminMenu.navMain;
    } else if (role === "petugas") {
      return PetugasMenu.navMain;
    } else if (role === "pelanggan") {
      return PelangganMenu.navMain;
    }
  };

  return (
    <Sidebar collapsible="icon" {...props} className={"font-schibsted-grotesk"}>
      <SidebarHeader>
        <TeamSwitcher teams={navigasi} />
      </SidebarHeader>
      <SidebarContent className={"bg-cyan-sky text-white"}>
        <NavMain items={menu()} />
        {/* <NavProjects projects={AdminMenu.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} loading={isLoading} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
