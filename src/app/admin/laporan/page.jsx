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
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Printer } from "lucide-react";
import LaporanTable from "@/components/admin/laporan";

export default function LaporanPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jenisFilter, setJenisFilter] = useState("all");
  const [petugasFilter, setPetugasFilter] = useState("all");

  const [petugasList, setPetugasList] = useState([]);
  const [jenisList, setJenisList] = useState([]);

  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: res, error } = await supabase
        .from("pemesanan")
        .select(
          "id, user_id (id, username, nama_lengkap), kendaraan_id (id, merk, jenis), tanggal_mulai, tanggal_selesai, total_harga, status, created_at"
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      const fokus = (res || []).filter((r) =>
        ["selesai", "dibatalkan"].includes(r.status)
      );

      setData(fokus || []);

      const jenis = Array.from(
        new Set((res || []).map((r) => r.kendaraan_id?.jenis).filter(Boolean))
      );
      setJenisList(jenis);

      const { data: users, error: uErr } = await supabase
        .from("users")
        .select("id, username, nama_lengkap")
        .eq("role", "petugas");
      if (uErr) throw uErr;
      setPetugasList(users || []);
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Gagal memuat data laporan");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  const filtered = useMemo(() => {
    let d = [...data];
    if (startDate)
      d = d.filter((r) => new Date(r.tanggal_mulai) >= new Date(startDate));
    if (endDate)
      d = d.filter((r) => new Date(r.tanggal_selesai) <= new Date(endDate));
    if (statusFilter !== "all") d = d.filter((r) => r.status === statusFilter);
    if (jenisFilter !== "all")
      d = d.filter((r) => r.kendaraan_id?.jenis === jenisFilter);
    if (petugasFilter !== "all")
      d = d.filter((r) => String(r.user_id?.id) === String(petugasFilter));
    return d;
  }, [data, startDate, endDate, statusFilter, jenisFilter, petugasFilter]);

  const exportPrint = () => {
    if (!filtered.length) return toast.error("Tidak ada data untuk diekspor");
    const win = window.open("", "_blank");
    const rowsHtml = filtered
      .map(
        (r, i) => `<tr>
          <td style='padding:8px;border:1px solid #ddd'>${i + 1}</td>
          <td style='padding:8px;border:1px solid #ddd'>${r.id}</td>
          <td style='padding:8px;border:1px solid #ddd'>${
            r.user_id?.nama_lengkap || r.user_id?.username || "-"
          }</td>
          <td style='padding:8px;border:1px solid #ddd'>${
            r.kendaraan_id?.merk || "-"
          }</td>
          <td style='padding:8px;border:1px solid #ddd'>${new Date(
            r.tanggal_mulai
          ).toLocaleDateString("id-ID")}</td>
          <td style='padding:8px;border:1px solid #ddd'>${new Date(
            r.tanggal_selesai
          ).toLocaleDateString("id-ID")}</td>
          <td style='padding:8px;border:1px solid #ddd'>Rp ${new Intl.NumberFormat(
            "id-ID"
          ).format(r.total_harga)}</td>
          <td style='padding:8px;border:1px solid #ddd'>${r.status}</td>
        </tr>`
      )
      .join("");

    win.document.write(`
      <html>
        <head>
          <title>Laporan Penyewaan</title>
        </head>
        <body>
          <h2>Laporan Penyewaan</h2>
          <table style='border-collapse:collapse;width:100%'>
            <thead>
              <tr>
                <th style='padding:8px;border:1px solid #ddd'>No</th>
                <th style='padding:8px;border:1px solid #ddd'>No Transaksi</th>
                <th style='padding:8px;border:1px solid #ddd'>Penyewa</th>
                <th style='padding:8px;border:1px solid #ddd'>Mobil</th>
                <th style='padding:8px;border:1px solid #ddd'>Mulai</th>
                <th style='padding:8px;border:1px solid #ddd'>Selesai</th>
                <th style='padding:8px;border:1px solid #ddd'>Total</th>
                <th style='padding:8px;border:1px solid #ddd'>Status</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    setStatusFilter("all");
    setJenisFilter("all");
    setPetugasFilter("all");
  };

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
                <BreadcrumbPage>Laporan</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <HeaderAdmin
        title={"Laporan Transaksi Penyewaan"}
        desc={
          "Ringkasan transaksi penyewaan yang sudah selesai atau dibatalkan"
        }
      />

      <div className="flex flex-col px-8 mt-6 mb-20 gap-4 font-schibsted-grotesk  ">
        <div className="flex flex-row lg:flex-nowrap md:flex-wrap flex-wrap gap-4 items-end">
          <div className="flex gap-2 items-center">
            <label className="text-sm">Dari</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center">
            <label className="text-sm">Sampai</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <Select
            // value={statusFilter}
            onValueChange={(v) => setStatusFilter(v)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="selesai">Selesai</SelectItem>
                <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            // value={jenisFilter}
            onValueChange={(v) => setJenisFilter(v)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Pilih jenis" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Jenis kendaraan</SelectLabel>
                <SelectItem value="all">Semua</SelectItem>
                {jenisList.map((j) => (
                  <SelectItem key={j} value={j}>
                    {j}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            // value={petugasFilter}
            onValueChange={(v) => setPetugasFilter(v)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Nama petugas" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Nama petugas</SelectLabel>
                <SelectItem value="all">Semua</SelectItem>
                {petugasList.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.nama_lengkap || p.username}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="ml-auto flex gap-2">
            <Button
              onClick={exportPrint}
              className="flex items-center gap-2 bg-cyan-sky cursor-pointer"
            >
              <Printer size={16} /> Cetak / PDF
            </Button>
            <Button variant={"ghost"} onClick={resetFilters}>
              Reset
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <LaporanTable loading={loading} data={filtered} />
        </div>
      </div>
    </>
  );
}
