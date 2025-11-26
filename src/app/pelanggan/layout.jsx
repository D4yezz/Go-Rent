"use client";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function PelangganLayout({ children }) {
  return (
    <SidebarProvider className="font-instrument">
      <AppSidebar role="pelanggan" />
      <SidebarInset className="flex flex-col w-full overflow-x-hidden">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
