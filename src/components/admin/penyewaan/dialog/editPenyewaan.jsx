"use client";

import React, { useState, useEffect } from "react";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import supabase from "@/lib/supabase/client";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pin } from "lucide-react";

export default function EditPenyewaan({ item, onClose, onSuccess }) {
  const TABLE = "pemesanan";

  const [tanggalMulai, setTanggalMulai] = useState(item?.tanggal_mulai || "");
  const [tanggalSelesai, setTanggalSelesai] = useState(
    item?.tanggal_selesai || ""
  );
  const [status, setStatus] = useState(item?.status || "pending");
  const [totalHarga, setTotalHarga] = useState(item?.total_harga || 0);
  const [isLoading, setIsLoading] = useState(false);
  const [days, setDays] = useState(0);

  useEffect(() => {
    if (tanggalMulai && tanggalSelesai) {
      const start = new Date(tanggalMulai);
      const end = new Date(tanggalSelesai);
      const daysCount = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

      if (daysCount > 0) {
        setDays(daysCount);
        const total = daysCount * (item?.kendaraan_id?.harga_per_hari || 0);
        setTotalHarga(total);
      } else {
        setDays(0);
        setTotalHarga(0);
      }
    }
  }, [tanggalMulai, tanggalSelesai, item?.kendaraan_id?.harga_per_hari]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!tanggalMulai || !tanggalSelesai || totalHarga <= 0) {
        toast.error("Mohon lengkapi semua field dengan benar");
        setIsLoading(false);
        return;
      }

      const start = new Date(tanggalMulai);
      const end = new Date(tanggalSelesai);

      if (end <= start) {
        toast.error("Tanggal selesai harus lebih besar dari tanggal mulai");
        setIsLoading(false);
        return;
      }

      const payload = {
        tanggal_mulai: tanggalMulai,
        tanggal_selesai: tanggalSelesai,
        total_harga: totalHarga,
        status,
      };

      const { error } = await supabase
        .from(TABLE)
        .update(payload)
        .eq("id", item.id);

      if (error) throw error;

      toast.success("Penyewaan berhasil diperbarui!");
      onClose();

      if (typeof onSuccess === "function") onSuccess();
    } catch (err) {
      console.error("Error updating Penyewaan:", err);
      toast.error(
        "Gagal memperbarui Penyewaan: " + (err.message || JSON.stringify(err))
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value || 0);
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  if (!item) return null;

  return (
    <>
      <DialogHeader className={"font-rethink"}>
        <DialogTitle className="text-2xl">Edit Pesanan Penyewaan</DialogTitle>
        <DialogDescription>
          Ubah tanggal, status, dan harga pesanan sewa dari{" "}
          {item.user_id?.username}
        </DialogDescription>
      </DialogHeader>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 mt-4 max-h-96 overflow-y-auto font-rethink"
      >
        <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-lg p-4">
          <div>
            <p className="text-sm text-slate-600">Pelanggan</p>
            <p className="font-semibold text-slate-900">
              {item.user_id?.username}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Kendaraan</p>
            <p className="font-semibold text-slate-900">
              {item.kendaraan_id?.merek}
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tanggal Mulai Sewa <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={tanggalMulai}
            onChange={(e) => setTanggalMulai(e.target.value)}
            className="w-full rounded border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-600"
            required
          />
          <p className="text-xs text-slate-500 mt-1">Format: YYYY-MM-DD</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tanggal Selesai Sewa <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={tanggalSelesai}
            onChange={(e) => setTanggalSelesai(e.target.value)}
            className="w-full rounded border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-600"
            required
          />
          <p className="text-xs text-slate-500 mt-1">Format: YYYY-MM-DD</p>
        </div>

        <div>
          <Label className="block text-sm font-medium text-slate-700 mb-2">
            Status Pesanan <span className="text-red-500">*</span>
          </Label>
          <Select onValueChange={setStatus} value={status}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="menunggu">Menunggu</SelectItem>
                <SelectItem value="disewa">Disewa</SelectItem>
                <SelectItem value="selesai">Selesai</SelectItem>
                <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {days > 0 && (
          <div className="bg-sky-50 rounded-lg p-4 space-y-3">
            <div>
              <p className="text-sm text-slate-600">Harga per Hari</p>
              <p className="font-semibold text-slate-900">
                {formatCurrency(item.kendaraan_id?.harga_per_hari || 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Durasi Sewa</p>
              <p className="font-semibold text-slate-900">{days} hari</p>
            </div>
            <div className="border-t border-sky-200 pt-3">
              <p className="text-sm text-slate-600">Total Harga</p>
              <p className="text-2xl font-bold text-sky-600">
                {formatCurrency(totalHarga)}
              </p>
            </div>
          </div>
        )}

        <div className="text-xs text-slate-500 bg-slate-50 rounded p-3 space-y-1">
          <p className="font-medium flex items-center gap-1">
            <Pin size={14} className="rotate-18" /> Catatan:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              Total harga akan otomatis dihitung berdasarkan tanggal dan durasi
            </li>
            <li>Pastikan tanggal selesai lebih besar dari tanggal mulai</li>
            <li>Status dapat diubah sesuai progress pesanan</li>
          </ul>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded bg-sky-600 text-white font-medium hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </>
  );
}
