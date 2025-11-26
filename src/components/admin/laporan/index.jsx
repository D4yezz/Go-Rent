"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function LaporanTable({ loading, data }) {
  const badgeStyle = (status) => {
    switch (status) {
      case "selesai":
        return "bg-sky-500";
      case "dibatalkan":
        return "bg-red-600";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <Table className="rounded-2xl overflow-hidden shadow-lg mb-8">
      <TableHeader className="bg-cyan-sky font-geist-sans">
        <TableRow className="text-white font-normal px-2">
          <TableHead className="text-center">No</TableHead>
          <TableHead>No Transaksi</TableHead>
          <TableHead>Nama Penyewa</TableHead>
          <TableHead>Mobil</TableHead>
          <TableHead>Tanggal</TableHead>
          <TableHead>Total Biaya</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={7}>Memuat...</TableCell>
          </TableRow>
        ) : (
          data.map((item, idx) => (
            <TableRow key={item.id} className="font-rethink">
              <TableCell className="text-center">{idx + 1}</TableCell>
              <TableCell>{item.id}</TableCell>

              <TableCell>
                {item.user_id?.nama_lengkap || item.user_id?.username}
              </TableCell>

              <TableCell>{item.kendaraan_id?.merk}</TableCell>

              <TableCell>
                {new Intl.DateTimeFormat("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }).format(new Date(item.tanggal_mulai))}
                <span className="mx-2">–</span>
                {new Intl.DateTimeFormat("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }).format(new Date(item.tanggal_selesai))}
              </TableCell>

              <TableCell>
                Rp{" "}
                {new Intl.NumberFormat("id-ID").format(item.total_harga)}
              </TableCell>

              <TableCell>
                <Badge className={`capitalize ${badgeStyle(item.status)}`}>
                  {item.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

