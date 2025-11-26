"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImagePlus, X } from "lucide-react";
import supabase from "@/lib/supabase/client";
import Image from "next/image";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EditKendaraan({ item, open, onOpenChange, onSuccess }) {
  const BUCKET = "rental";
  const TABLE = "kendaraan";

  const [fotoFile, setFotoFile] = useState(null);
  const [preview, setPreview] = useState(item?.foto_url || null);
  const [merk, setMerk] = useState(item?.merk || "");
  const [deskripsi, setDeskripsi] = useState(item?.deskripsi || "");
  const [jenis, setJenis] = useState(item?.jenis || "");
  const [transmisi, setTransmisi] = useState(item?.transmisi || "Manual");
  const [warna, setWarna] = useState(item?.warna || "");
  const [hargaPerHari, setHargaPerHari] = useState(item?.harga_per_hari || 0);
  const [status, setStatus] = useState(item?.status || "Tersedia");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (item && open) {
      setMerk(item.merk || "");
      setDeskripsi(item.deskripsi || "");
      setJenis(item.jenis || "");
      setTransmisi(item.transmisi || "Manual");
      setWarna(item.warna || "");
      setHargaPerHari(item.harga_per_hari || 0);
      setStatus(item.status || "Tersedia");
      setPreview(item.foto_url || null);
      setFotoFile(null);
    }
  }, [item, open]);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0] || null;
    setFotoFile(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let fotoUrl = item?.foto_url;

      if (fotoFile) {
        if (item?.foto_url) {
          const oldFileName = item.foto_url.split("/").pop();
          await supabase.storage
            .from(BUCKET)
            .remove(["kendaraan/" + oldFileName]);
        }

        const fileExt = fotoFile.name.split(".").pop();
        const fileName = `kendaraan/${item.id}_${Date.now()}.${fileExt}`;
        const filePath = fileName;

        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(filePath, fotoFile, { cacheControl: "3600", upsert: false });

        if (uploadError) throw uploadError;

        const { data: publicData } = supabase.storage
          .from(BUCKET)
          .getPublicUrl(filePath);
        fotoUrl = publicData?.publicUrl || null;
      }

      const payload = {
        foto_url: fotoUrl,
        merk,
        deskripsi,
        jenis,
        transmisi,
        warna,
        harga_per_hari: Number(hargaPerHari) || 0,
        status,
      };

      const { error } = await supabase
        .from(TABLE)
        .update(payload)
        .eq("id", item.id);

      if (error) throw error;

      toast.success("Kendaraan berhasil diperbarui");
      onOpenChange(false);

      if (typeof onSuccess === "function") onSuccess();
    } catch (err) {
      console.error("Error updating kendaraan:", err);
      alert(
        "Gagal memperbarui kendaraan: " + (err.message || JSON.stringify(err))
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-screen overflow-y-auto max-w-2xl font-schibsted-grotesk">
        <DialogHeader>
          <DialogTitle>Edit Kendaraan</DialogTitle>
          <DialogDescription>
            Perbarui data kendaraan {item.merk}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="flex gap-4 w-full">
            <div className="w-40">
              <Label className="block text-sm font-medium text-slate-700">
                Foto
              </Label>
              <div className="mt-2 flex items-center gap-4">
                <Label htmlFor="foto">
                  {preview && (
                    <div className="relative w-24 h-20 rounded overflow-hidden">
                      <Image
                        src={preview}
                        alt="preview"
                        fill
                        className="object-cover"
                        sizes="100px"
                      />
                    </div>
                  )}
                </Label>
                <Input
                  type="file"
                  accept="image/*"
                  id="foto"
                  className={"hidden"}
                  onChange={handleFileChange}
                  required={!item?.foto_url}
                />
              </div>
            </div>

            <div className="w-full space-y-2">
              <Label>Merek</Label>
              <Input
                type="text"
                value={merk}
                onChange={(e) => setMerk(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Deskripsi
            </label>
            <textarea
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="w-full rounded border border-slate-300 px-3 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Jenis
              </label>
              <input
                type="text"
                value={jenis}
                onChange={(e) => setJenis(e.target.value)}
                className="w-full rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Transmisi
              </label>
              <select
                value={transmisi}
                onChange={(e) => setTransmisi(e.target.value)}
                className="w-full rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Manual</option>
                <option>Otomatis</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Warna
              </label>
              <input
                type="text"
                value={warna}
                onChange={(e) => setWarna(e.target.value)}
                className="w-full rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Harga per hari (Rp)
              </label>
              <input
                type="number"
                value={hargaPerHari}
                onChange={(e) => setHargaPerHari(e.target.value)}
                className="w-full rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={0}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Tersedia">Tersedia</option>
              <option value="Tidak tersedia">Tidak Tersedia</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t">
            <Button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 rounded border bg-white border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-sky-600 text-white rounded font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
