"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal, ScanEye, SquarePen, Trash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import supabase from "@/lib/supabase/client";
import DetailPenyewaan from "./dialog/detailPenyewaan";
import EditPenyewaan from "./dialog/editPenyewaan";

export default function PenyewaanTable({ penyewaan, loading, onRefresh }) {
  const [deletingId, setDeletingId] = useState(null);
  const [openDialogId, setOpenDialogId] = useState(null);
  const [selectedPenyewaan, setSelectedPenyewaan] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  if (loading) {
    return <Skeleton className={"w-full h-[250px]"} />;
  }

  const badgeStyle = (penyewaan) => {
    switch (penyewaan.status) {
      case "selesai":
        return "bg-sky-500";
      case "menunggu":
        return "bg-yellow-300 text-black";
      default:
        return "bg-red-600";
    }
  };

  const deleteProduct = async (penyewaanId) => {
    try {
      setDeletingId(penyewaanId);
      const { error: productError } = await supabase
        .from("pemesanan")
        .delete()
        .eq("id", penyewaanId);

      if (productError) throw productError;

      toast.success("Penyewaan berhasil dihapus!");
      onRefresh();
      setOpenDialogId(null);
    } catch (err) {
      console.error("Gagal menghapus data :", err);
      toast.error("Terjadi kesalahan saat menghapus data");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditSuccess = () => {
    setEditOpen(false);
    setEditItem(null);
    if (typeof onRefresh === "function") onRefresh();
  };

  return (
    <>
      <Table className={"rounded-2xl overflow-hidden shadow-lg mb-8"}>
        <TableHeader className={"bg-cyan-sky font-geist-sans"}>
          <TableRow className={"text-white font-normal px-2"}>
            <TableHead className={"text-center"}>No</TableHead>
            <TableHead>Pelanggan</TableHead>
            <TableHead>Kendaraan</TableHead>
            <TableHead>Tanggal Mulai</TableHead>
            <TableHead>Tanggal Selesai</TableHead>
            <TableHead>Total Harga</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className={"text-center"}>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {penyewaan.map((item, index) => (
            <TableRow key={index} className={"font-rethink"}>
              <TableCell className="font-medium text-center">
                {index + 1}
              </TableCell>
              <TableCell>{item.user_id.username}</TableCell>
              <TableCell>{item.kendaraan_id.merek}</TableCell>
              <TableCell>
                {new Intl.DateTimeFormat("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }).format(new Date(item.tanggal_mulai))}
              </TableCell>
              <TableCell>
                {new Intl.DateTimeFormat("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }).format(new Date(item.tanggal_selesai))}
              </TableCell>
              <TableCell>
                Rp {new Intl.NumberFormat("id-ID").format(item.total_harga)}
              </TableCell>
              <TableCell>
                <Badge className={`capitalize ${badgeStyle(item)}`}>
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2 justify-center">
                  <Dialog>
                    <DialogTrigger className="bg-sky-200 hover:bg-sky-400 text-sky-800 px-2.5 py-2 h-auto cursor-pointer rounded-lg">
                      <ScanEye className="w-4 h-4" />
                    </DialogTrigger>
                    <DialogContent
                      className={"font-rethink max-h-screen overflow-y-auto"}
                    >
                      <DetailPenyewaan item={item} />
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger
                      onClick={() => setEditItem(item)}
                      className="bg-sky-800 hover:bg-sky-700 text-sky-100 px-3 py-2 h-auto cursor-pointer rounded-md"
                    >
                      <SquarePen className="w-4 h-4" />
                    </DialogTrigger>
                    <DialogContent className="max-h-screen overflow-y-auto">
                      {editItem && (
                        <EditPenyewaan
                          item={editItem}
                          onClose={() => setEditOpen(false)}
                          onSuccess={handleEditSuccess}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                  <AlertDialog
                    open={openDialogId === item.id}
                    onOpenChange={(open) => {
                      if (!open && deletingId === item.id) return;
                      setOpenDialogId(open ? item.id : null);
                    }}
                  >
                    <AlertDialogTrigger className="bg-red-600 hover:bg-red-800 text-white p-2.5 h-auto rounded-md flex items-center justify-center cursor-pointer">
                      <Trash className="w-4 h-4" />
                    </AlertDialogTrigger>
                    <AlertDialogContent className={"font-schibsted-grotesk"}>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                          data ini akan dihapus secara permanen.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={deletingId === item.id}>
                          Batal
                        </AlertDialogCancel>
                        <button
                          className="bg-red-600 text-white px-4 py-2 rounded-md cursor-pointer font-medium hover:bg-red-700"
                          onClick={() => deleteProduct(item.id, item.foto_url)}
                          disabled={deletingId === item.id}
                        >
                          {deletingId === item.id ? "Menghapus..." : "Hapus"}
                        </button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
