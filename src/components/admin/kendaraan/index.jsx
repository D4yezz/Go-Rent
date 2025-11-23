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
import { useState } from "react";
export default function KendaraanTable({ kendaraan, loading }) {
  const [open, setOpen] = useState(null);
  if (loading) {
    return <Skeleton className={"w-full h-[250px]"} />;
  }
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
            <TableHead></TableHead>
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className={"font-instrument-sans"}
                  >
                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setOpen(item)}>
                      <ScanEye />
                      Lihat
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <SquarePen />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Trash /> Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ViewKendaraan open={open} onOpenChange={setOpen} item={open} />
    </>
  );
}
