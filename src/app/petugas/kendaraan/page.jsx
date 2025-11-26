"use client";

import { toast } from "sonner";
import KendaraanTable from "@/components/admin/kendaraan";
import FormKendaraan from "@/components/admin/kendaraan/formKendaraan";
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
export default function KendaraanPetugas() {
  const [kendaraan, setKendaraan] = useState([]);
  const [loading, setLoading] = useState(true);

  const getKendaraan = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("kendaraan").select("*");
      if (error) {
        toast.error(error?.message || null);
      } else {
        setKendaraan(data || []);
      }
    } catch (error) {
      toast.error(error?.message || null);
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    getKendaraan();
  }, [getKendaraan]);

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
                <BreadcrumbLink href="/petugas/dashboard">Petugas</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Kendaraan</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <HeaderAdmin
        title={"Data Kendaraan"}
        desc={"Kelola kendaraan yang akan disewakan dengan praktis"}
        action={<FormKendaraan onSuccess={getKendaraan} />}
      />
      <div className="flex flex-col px-8 mt-8 mb-20 gap-4">
        <KendaraanTable
          kendaraan={kendaraan}
          loading={loading}
          onRefresh={getKendaraan}
        />
      </div>
    </>
  );
}
