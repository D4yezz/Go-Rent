"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import supabase from "@/lib/supabase/client";
import { getProfileUser } from "@/service/auth.service";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FormCar({
  showForm,
  setShowForm,
  idMobil,
  onSuccess = () => {},
}) {
  const [kendaraanList, setKendaraanList] = useState([]);
  const [selectedKendaraan, setSelectedKendaraan] = useState("");
  const [kendaraanDetails, setKendaraanDetails] = useState(null);

  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const [totalHarga, setTotalHarga] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showForm]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await getProfileUser();
        if (user.status && user.data) {
          setUserId(user.data.profile?.id);
        }

        const { data, error } = await supabase
          .from("kendaraan")
          .select("*")
          .eq("status", "Tersedia");

        if (error) throw error;
        setKendaraanList(data);
      } catch (err) {
        console.error(err);
        toast.error("Gagal memuat data kendaraan");
      }
    };

    loadData();
  }, []);
  useEffect(() => {
    if (idMobil) {
      setSelectedKendaraan(idMobil);
    }
  }, [idMobil]);

  useEffect(() => {
    if (selectedKendaraan) {
      const found = kendaraanList.find(
        (k) => k.id?.toString() === selectedKendaraan
      );
      setKendaraanDetails(found || null);
    } else {
      setKendaraanDetails(null);
    }
  }, [selectedKendaraan, kendaraanList]);

  useEffect(() => {
    if (tanggalMulai && tanggalSelesai && kendaraanDetails) {
      const start = new Date(tanggalMulai);
      const end = new Date(tanggalSelesai);

      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

      if (days > 0) {
        setTotalHarga(days * kendaraanDetails.harga_per_hari);
      } else {
        setTotalHarga(0);
      }
    }
  }, [tanggalMulai, tanggalSelesai, kendaraanDetails]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!selectedKendaraan || !tanggalMulai || !tanggalSelesai) {
        toast.error("Mohon lengkapi semua field");
        setIsLoading(false);
        return;
      }

      const payload = {
        user_id: userId,
        kendaraan_id: selectedKendaraan,
        tanggal_mulai: tanggalMulai,
        tanggal_selesai: tanggalSelesai,
        total_harga: totalHarga,
        status: "menunggu",
      };

      const { error } = await supabase.from("pemesanan").insert([payload]);
      if (error) throw error;

      toast.success("Pesanan berhasil dibuat!");
      onSuccess();
      setShowForm(false);
    } catch (err) {
      toast.error("Gagal membuat pesanan");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (n) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(n || 0);

  const today = new Date().toISOString().split("T")[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
      onClick={() => setShowForm(false)}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto font-instrument-sans"
      >
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Sewa Mobil</h2>
          <button
            onClick={() => setShowForm(false)}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <Label>Pilih Kendaraan</Label>
            <Select
              onValueChange={(v) => setSelectedKendaraan(v)}
              value={idMobil}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih kendaraan..." />
              </SelectTrigger>
              <SelectContent>
                {kendaraanList.map((item, index) => (
                  <SelectItem key={index} value={item?.id}>
                    {item?.merk} ({formatCurrency(item?.harga_per_hari)}/hari)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {kendaraanDetails && (
            <div className="bg-sky-50 p-4 rounded-lg text-sm">
              <p className="font-medium">{kendaraanDetails.merek}</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <p>Jenis: {kendaraanDetails.jenis}</p>
                <p>Transmisi: {kendaraanDetails.transmisi}</p>
                <p>Warna: {kendaraanDetails.warna}</p>
                <p>Harga: {formatCurrency(kendaraanDetails.harga_per_hari)}</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Tanggal Mulai</Label>
            <Input
              type="date"
              min={today}
              value={tanggalMulai}
              onChange={(e) => setTanggalMulai(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Tanggal Selesai</Label>
            <Input
              type="date"
              min={tanggalMulai || today}
              value={tanggalSelesai}
              onChange={(e) => setTanggalSelesai(e.target.value)}
            />
          </div>

          {totalHarga > 0 && kendaraanDetails && (
            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span>Harga per Hari</span>
                <span>{formatCurrency(kendaraanDetails.harga_per_hari)}</span>
              </div>

              <div className="flex justify-between">
                <span>Jumlah Hari</span>
                <span>
                  {Math.ceil(
                    (new Date(tanggalSelesai) - new Date(tanggalMulai)) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  hari
                </span>
              </div>

              <div className="flex justify-between font-bold text-sky-700 text-lg">
                <span>Total</span>
                <span>{formatCurrency(totalHarga)}</span>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 border px-4 py-3 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-sky-600 text-white px-4 py-3 rounded-lg hover:bg-sky-700 disabled:opacity-50"
            >
              {isLoading ? "Processing..." : "Pesan Sekarang"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
