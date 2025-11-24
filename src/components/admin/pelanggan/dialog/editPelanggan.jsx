"use client";

import React, { useState, useEffect } from "react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import supabase from "@/lib/supabase/client";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EditPelanggan({ item, onClose, onSuccess }) {
  const TABLE = "users";

  const [username, setUsername] = useState(item?.username || "");
  const [namaLengkap, setNamaLengkap] = useState(item?.nama_lengkap || "");
  const [email, setEmail] = useState(item?.email || "");
  const [noHp, setNoHp] = useState(item?.no_hp || "");
  const [role, setRole] = useState(item?.role || "user");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setUsername(item.username || "");
      setNamaLengkap(item.nama_lengkap || "");
      setEmail(item.email || "");
      setNoHp(item.no_hp || "");
      setRole(item.role || "user");
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!username || !email) {
        toast.error("Username dan email wajib diisi");
        setIsLoading(false);
        return;
      }

      const payload = {
        username,
        nama_lengkap: namaLengkap,
        email,
        no_hp: noHp,
        role,
      };

      const { error } = await supabase
        .from(TABLE)
        .update(payload)
        .eq("id", item.id);
      if (error) throw error;

      toast.success("Data pelanggan berhasil diperbarui");
      onClose();
      if (typeof onSuccess === "function") onSuccess();
    } catch (err) {
      console.error(err);
      toast.error(
        "Gagal memperbarui pelanggan: " + (err.message || JSON.stringify(err))
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!item) return null;

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl">Edit Pelanggan</DialogTitle>
        <DialogDescription>Perbarui informasi pelanggan.</DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div>
          <label className="block text-sm text-slate-600">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded border px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-slate-600">Nama Lengkap</label>
          <input
            value={namaLengkap}
            onChange={(e) => setNamaLengkap(e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-600">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-slate-600">No. HP</label>
          <input
            type="number"
            min={0}
            value={noHp}
            onChange={(e) => setNoHp(e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <div className="space-y-2">
          <Label className="block text-sm text-slate-600">Role</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">Pelanggan</SelectItem>
              <SelectItem value="petugas">Petugas</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded border"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 rounded bg-sky-600 text-white"
          >
            {isLoading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </>
  );
}
