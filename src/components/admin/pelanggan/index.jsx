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
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ViewPelanggan from "./dialog/viewPelanggan";
import EditPelanggan from "./dialog/editPelanggan";
import FormPelanggan from "./formPelanggan";
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
import { supabaseService } from "@/lib/supabase/admin";

export default function PelangganTable({ pelanggan, loading, onSuccess }) {
  const [deletingId, setDeletingId] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [openDialogId, setOpenDialogId] = useState(null);
  //   const [createRefreshToggle, setCreateRefreshToggle] = useState(false);

  const deleteUser = async (userId) => {
    try {
      setDeletingId(userId);
      const { error } = await supabase.from("users").delete().eq("id", userId);
      const res = await fetch("/api/delete-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error("Gagal menghapus dari auth.users");

      if (error) throw error;
      toast.success("Pelanggan berhasil dihapus");
      if (typeof onSuccess === "function") onSuccess();
    } catch (err) {
      console.error(err);
      toast.error(
        "Gagal menghapus pelanggan: " + (err.message || JSON.stringify(err))
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <Skeleton className={"w-full h-[250px]"} />;
  }

  const badgeRole = (item) => {
    if (item.role === "admin") {
      return <Badge className={"bg-red-500"}>Admin</Badge>;
    } else if (item.role === "petugas") {
      return <Badge className={"bg-sky-500"}>Admin</Badge>;
    } else {
      return <Badge className={"bg-green-500"}>Pelanggan</Badge>;
    }
  };

  return (
    <>
      <Table className={"rounded-2xl overflow-hidden shadow-lg mb-8"}>
        <TableHeader className={"bg-cyan-sky font-geist-sans"}>
          <TableRow className={"text-white font-normal px-2"}>
            <TableHead className={"text-center"}>No</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Nama Lengkap</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Nomor Hp</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Dibuat Pada</TableHead>
            <TableHead className={"text-center"}>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pelanggan.map((item, index) => (
            <TableRow key={index} className={"font-rethink"}>
              <TableCell className="font-medium text-center">
                {index + 1}
              </TableCell>
              <TableCell className="px-4 max-w-50 h-full">
                <p className="text-balance line-clamp-2">{item.username}</p>
              </TableCell>
              <TableCell className="px-4 max-w-50 h-full">
                <p className="text-balance line-clamp-2">
                  {item.nama_lengkap || "-"}
                </p>
              </TableCell>
              <TableCell className="px-4 max-w-50 h-full">
                <p className="text-balance line-clamp-2">{item.email}</p>
              </TableCell>
              <TableCell className="px-4 max-w-50 h-full">
                <p className="text-balance line-clamp-2">{item.no_hp || "-"}</p>
              </TableCell>
              <TableCell>{badgeRole(item)}</TableCell>
              <TableCell className="px-4 max-w-50 h-full">
                <p className="text-balance line-clamp-2">
                  {new Intl.DateTimeFormat("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }).format(new Date(item.created_at))}
                </p>
              </TableCell>

              <TableCell>
                <div className="flex gap-2 justify-center">
                  <Button
                    size="sm"
                    className="bg-sky-300 hover:bg-sky-400 text-sky-800 px-3 py-2 h-auto cursor-pointer"
                    title="Lihat"
                    onClick={() => setViewItem(item)}
                  >
                    <ScanEye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    className="bg-sky-800 hover:bg-sky-700 text-sky-100 px-3 py-2 h-auto cursor-pointer"
                    title="Edit"
                    onClick={() => {
                      setEditItem(item);
                      setEditOpen(true);
                    }}
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
                          Akun ini akan dihapus secara permanen.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={deletingId === item.id}>
                          Batal
                        </AlertDialogCancel>
                        <Button
                          className="bg-red-600 text-white px-4 py-2 rounded-md cursor-pointer font-medium hover:bg-red-700"
                          onClick={() => deleteUser(item.id)}
                          disabled={deletingId === item.id}
                        >
                          {deletingId === item.id ? "Menghapus..." : "Hapus"}
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {viewItem && (
        <Dialog
          open={!!viewItem}
          onOpenChange={(open) => {
            if (!open) setViewItem(null);
          }}
        >
          <DialogContent className="max-w-md font-schibsted-grotesk">
            <ViewPelanggan item={viewItem} />
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg font-schibsted-grotesk">
          {editItem && (
            <EditPelanggan
              item={editItem}
              onClose={() => setEditOpen(false)}
              onSuccess={() => {
                setEditOpen(false);
                setEditItem(null);
                if (typeof onSuccess === "function") onSuccess();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
