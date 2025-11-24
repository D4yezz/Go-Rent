"use client";
import DashboardView from "@/components/admin/dashboard";
import PelangganTable from "@/components/admin/pelanggan";
import FormPelanggan from "@/components/admin/pelanggan/formPelanggan";
import HeaderAdmin from "@/components/layout/headerAdmin";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import supabase from "@/lib/supabase/client";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function CustomerPage() {
  const [allUser, setAllUser] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllUser = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("users").select("*");
      if (error) {
        toast.error(error?.message || null);
      } else {
        setAllUser(data || []);
      }
    } catch (error) {
      toast.error(error?.message || null);
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    getAllUser();
  }, [getAllUser]);

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 font-instrument-sans">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/admin/dashboard">Admin</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Pelanggan</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <HeaderAdmin
        title={"Data Pelanggan"}
        desc={"Kelola pelanggan yang akan disewakan dengan praktis"}
        action={<FormPelanggan onSuccess={getAllUser} />}
      />
      <div className="flex flex-col px-8 mt-8 mb-20 gap-4">
        <PelangganTable
          pelanggan={allUser}
          loading={loading}
          onSuccess={getAllUser}
        />
      </div>
    </>
  );
}
