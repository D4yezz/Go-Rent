"use client";

import { toast } from "sonner";
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
import PenyewaanTable from "@/components/admin/penyewaan";
import { AnimatePresence } from "framer-motion";
import FormCar from "@/components/views/cars/formCar";
import { CirclePlus, PlusCircle } from "lucide-react";

export default function PenyewaanPage() {
  const [penyewaan, setPenyewaan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const getPenyewaan = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("pemesanan")
        .select(
          "id, user_id (id, username), kendaraan_id (id, merk, jenis, warna, harga_per_hari, status, deskripsi, foto_url, transmisi), tanggal_mulai, tanggal_selesai, total_harga, status"
        );
      if (error) {
        toast.error(error?.message || null);
      } else {
        setPenyewaan(data || []);
      }
    } catch (error) {
      toast.error(error?.message || null);
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    getPenyewaan();
  }, [getPenyewaan]);
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
                <BreadcrumbPage>Pemesanan</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <HeaderAdmin
        title={"Data Penyewaan"}
        desc={"Kelola penyewaan kendaraan dari pelanggan dengan praktis"}
        action={
          <button
            onClick={() => setShowForm(true)}
            className="bg-cyan-sky rounded-md flex items-center gap-2 py-2 px-4 text-white cursor-pointer"
          >
            <CirclePlus size={20} />
            Tambah Penyewaan
          </button>
        }
      />
      <div className="flex flex-col px-8 mt-8 mb-20 gap-4">
        <PenyewaanTable
          penyewaan={penyewaan}
          loading={loading}
          onRefresh={getPenyewaan}
        />
        <AnimatePresence>
          {showForm ? (
            <FormCar setShowForm={setShowForm} onSuccess={getPenyewaan} />
          ) : null}
        </AnimatePresence>
      </div>
    </>
  );
}
