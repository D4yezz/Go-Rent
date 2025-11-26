"use client";

import { useEffect, useState } from "react";
import { getProfileUser } from "@/service/auth.service";
import supabase from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Printer } from "lucide-react";

export default function RiwayatView() {
  const [loading, setLoading] = useState(true);
  const [pemesanan, setPemesanan] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const user = await getProfileUser();
        if (!user || !user.status || !user.data) {
          setPemesanan([]);
          setLoading(false);
          return;
        }

        const prof = user.data.profile;
        const { data, error } = await supabase
          .from("pemesanan")
          .select(
            "id, kendaraan_id (id, merk), tanggal_mulai, tanggal_selesai, total_harga, status, created_at"
          )
          .eq("user_id", prof.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setPemesanan(data || []);
      } catch (err) {
        console.error(err);
        toast.error("Gagal memuat riwayat penyewaan");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const badgeClass = (status) => {
    switch ((status || "").toLowerCase()) {
      case "menunggu":
      case "menungguu":
        return "bg-yellow-300 text-black";
      case "disewa":
        return "bg-blue-500 text-white";
      case "selesai":
        return "bg-green-600 text-white";
      case "gagal":
      case "dibatalkan":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  const printReceipt = (item) => {
    const win = window.open("", "_blank");
    const html = `
      <html>
        <head>
          <title>Struk Penyewaan - ${item.id}</title>
          <style>body{font-family:Arial,Helvetica,sans-serif;padding:20px}table{width:100%;border-collapse:collapse}td,th{padding:8px;border:1px solid #ddd}</style>
        </head>
        <body>
          <h2>Struk Penyewaan</h2>
          <p><strong>No Transaksi:</strong> ${item.id}</p>
          <p><strong>Mobil:</strong> ${item.kendaraan_id?.merk || "-"}</p>
          <p><strong>Tanggal:</strong> ${new Date(
            item.tanggal_mulai
          ).toLocaleDateString("id-ID")} - ${new Date(
      item.tanggal_selesai
    ).toLocaleDateString("id-ID")}</p>
          <p><strong>Total:</strong> Rp ${new Intl.NumberFormat("id-ID").format(
            item.total_harga
          )}</p>
          <p><strong>Status:</strong> ${item.status}</p>
          <hr />
          <p>Terima kasih telah menggunakan layanan Go - Rent.</p>
        </body>
      </html>
    `;
    win.document.write(html);
    win.document.close();
    win.print();
  };

  return (
    <Table className="rounded-2xl overflow-hidden shadow mb-6 font-geist-sans">
      <TableHeader className="bg-cyan-sky text-white">
        <TableRow>
          <TableHead className="text-center">No</TableHead>
          <TableHead>No Transaksi</TableHead>
          <TableHead>Mobil</TableHead>
          <TableHead>Tanggal</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-center">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={7}>Memuat...</TableCell>
          </TableRow>
        ) : pemesanan.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7}>Belum ada riwayat penyewaan</TableCell>
          </TableRow>
        ) : (
          pemesanan.map((item, idx) => (
            <TableRow key={item.id}>
              <TableCell className="text-center">{idx + 1}</TableCell>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.kendaraan_id?.merk}</TableCell>
              <TableCell>
                {new Intl.DateTimeFormat("id-ID", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }).format(new Date(item.tanggal_mulai))}
                <span className="mx-2">–</span>
                {new Intl.DateTimeFormat("id-ID", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }).format(new Date(item.tanggal_selesai))}
              </TableCell>
              <TableCell>
                Rp {new Intl.NumberFormat("id-ID").format(item.total_harga)}
              </TableCell>
              <TableCell>
                <Badge className={`capitalize ${badgeClass(item.status)}`}>
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Button
                  onClick={() => printReceipt(item)}
                  className="bg-cyan-sky"
                >
                  <Printer size={14} />
                  Cetak Struk
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
