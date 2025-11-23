"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import ViewKendaraan from "./dialog/viewKendaraan";
import EditKendaraan from "./dialog/editKendaraan";
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

export default function KendaraanTable({ kendaraan, loading, onRefresh }) {
  const [openView, setOpenView] = useState(null);
  const [openEdit, setOpenEdit] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [openDialogId, setOpenDialogId] = useState(null);

  if (loading) {
    return <Skeleton className={"w-full h-[250px]"} />;
  }

  const handleEditSuccess = () => {
    setOpenEdit(null);
    if (typeof onRefresh === "function") onRefresh();
  };

  const deleteProduct = async (kendaraanId, fotoPath) => {
    try {
      setDeletingId(kendaraanId);

      if (fotoPath) {
        const relativePath = fotoPath.split("/rental/")[1];

        const { error: removeError } = await supabase.storage
          .from("rental")
          .remove([relativePath]);

        if (removeError) throw removeError;
      }
      const { error: productError } = await supabase
        .from("kendaraan")
        .delete()
        .eq("id", kendaraanId);

      if (productError) throw productError;

      toast.success("Kendaraan berhasil dihapus!");
      onRefresh();
      setOpenDialogId(null);
    } catch (err) {
      console.error("Gagal menghapus produk :", err);
      toast.error("Terjadi kesalahan saat menghapus produk");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <Table className={"rounded-2xl overflow-hidden shadow-lg mb-8"}>
        <TableHeader className={"bg-cyan-sky font-geist-sans"}>
          <TableRow className={"text-white font-normal px-2"}>
            <TableHead className={"text-center"}>No</TableHead>
            <TableHead>Foto</TableHead>
            <TableHead>Merek</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead>Jenis</TableHead>
            <TableHead>Transmisi</TableHead>
            <TableHead>Warna</TableHead>
            <TableHead>Harga / Hari</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className={"text-center"}>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {kendaraan.map((item, index) => (
            <TableRow key={index} className={"font-rethink"}>
              <TableCell className="font-medium text-center">
                {index + 1}
              </TableCell>
              <TableCell>
                <div className="w-24 h-24 rounded-lg overflow-hidden shadow-md border-2 border-sky-600">
                  <Image
                    src={item.foto_url}
                    width={1000}
                    height={1000}
                    alt={item.merk}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </TableCell>
              <TableCell>{item.merk}</TableCell>
              <TableCell className="px-4 max-w-50 h-full">
                <p className="text-balance line-clamp-2">
                  {item.deskripsi || "-"}
                </p>
              </TableCell>
              <TableCell>{item.jenis}</TableCell>
              <TableCell>{item.transmisi}</TableCell>
              <TableCell>{item.warna}</TableCell>
              <TableCell>{item.harga_per_hari}</TableCell>
              <TableCell>
                <Badge
                  className={
                    item.status === "Tersedia" ? "bg-sky-600" : "bg-red-600"
                  }
                >
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2 justify-center">
                  <Button
                    size="sm"
                    className="bg-sky-300 hover:bg-sky-400 text-sky-800 px-3 py-2 h-auto cursor-pointer"
                    title="Lihat"
                    onClick={() => setOpenView(item)}
                  >
                    <ScanEye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    className="bg-sky-800 hover:bg-sky-700 text-sky-100 px-3 py-2 h-auto cursor-pointer"
                    title="Edit"
                    onClick={() => setOpenEdit(item)}
                  >
                    <SquarePen className="w-4 h-4" />
                  </Button>
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
                          Kendaraan ini akan dihapus secara permanen.
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

      <ViewKendaraan
        open={openView}
        onOpenChange={setOpenView}
        item={openView}
      />

      <EditKendaraan
        item={openEdit}
        open={!!openEdit}
        onOpenChange={setOpenEdit}
        onSuccess={handleEditSuccess}
      />
    </>
  );
}
