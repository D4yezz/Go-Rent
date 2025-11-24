"use client";

import React from "react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { User, Mail, Phone, IdCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function ViewPelanggan({ item }) {
  if (!item) return null;
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl">Detail Pelanggan</DialogTitle>
        <DialogDescription>
          Informasi lengkap tentang pelanggan.
        </DialogDescription>
      </DialogHeader>
      <Separator />

      <div className="space-y-4 mt-4">
        <div className="grid grid-cols-1 gap-3">
          <div>
            <p className="text-sm text-slate-600">Username</p>
            <p className="font-medium text-slate-900">{item.username}</p>
          </div>

          <div>
            <p className="text-sm text-slate-600">Nama Lengkap</p>
            <p className="font-medium text-slate-900">
              {item.nama_lengkap || "-"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sky-100 bg-cyan-sky p-2 rounded-full">
              <Mail size={20} />
            </span>
            <div>
              <p className="text-sm text-slate-600">Email</p>
              <p className="font-medium text-slate-900">{item.email || "-"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sky-100 bg-cyan-sky p-2 rounded-full">
              <Phone size={20} />
            </span>
            <div>
              <p className="text-sm text-slate-600">No. HP</p>
              <p className="font-medium text-slate-900">{item.no_hp || "-"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sky-100 bg-cyan-sky p-2 rounded-full">
              <IdCard size={20} />
            </span>
            <div>
              <p className="text-sm text-slate-600">Role</p>
              <p className="font-medium text-slate-900">
                {(() => {
                  const badgeClass =
                    item.role === "admin"
                      ? "bg-red-500"
                      : item.role === "petugas"
                      ? "bg-sky-500"
                      : "bg-green-500";
                  return <Badge className={badgeClass}>{item.role}</Badge>;
                })()}
              </p>
            </div>
          </div>

          {item.created_at && (
            <div>
              <p className="text-sm text-slate-600">Dibuat pada</p>
              <p className="font-medium text-slate-900">
                {new Intl.DateTimeFormat("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }).format(new Date(item.created_at))}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
