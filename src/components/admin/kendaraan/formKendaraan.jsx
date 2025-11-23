"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import supabase from "@/lib/supabase/client";
import { toast } from "sonner";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CirclePlus, ImagePlus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function FormKendaraan({ onSuccess }) {
  const BUCKET = "rental";
  const TABLE = "kendaraan";
  const [open, setOpen] = useState(false);
  const [fotoFile, setFotoFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [merek, setMerek] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [jenis, setJenis] = useState("");
  const [transmisi, setTransmisi] = useState("Manual");
  const [warna, setWarna] = useState("");
  const [hargaPerHari, setHargaPerHari] = useState("");
  const [status, setStatus] = useState("Tersedia");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0] || null;
    setFotoFile(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let fotoUrl = null;

      if (fotoFile) {
        const fileExt = fotoFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `kendaraan/foto_${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(filePath, fotoFile, { cacheControl: "3600", upsert: false });

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicData } = supabase.storage
          .from(BUCKET)
          .getPublicUrl(filePath);
        fotoUrl = publicData?.publicUrl || null;
      }

      const payload = {
        foto_url: fotoUrl,
        merk: merek,
        deskripsi,
        jenis,
        transmisi,
        warna,
        harga_per_hari: Number(hargaPerHari) || 0,
        status,
      };

      const { data, error } = await supabase.from(TABLE).insert([payload]);
      if (error) throw error;

      setOpen(false);
      toast.success("Kendaraan berhasil ditambahkan");
      setMerek("");
      setDeskripsi("");
      setJenis("");
      setTransmisi("Manual");
      setWarna("");
      setHargaPerHari(0);
      setStatus("Tersedia");
      setFotoFile(null);
      setPreview(null);

      if (typeof onSuccess === "function") onSuccess(data);
    } catch (err) {
      console.error("Error adding kendaraan:", err);
      toast.error(
        "Gagal menambahkan kendaraan: " + (err.message || JSON.stringify(err))
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="bg-cyan-sky rounded-full flex items-center gap-2 py-2 px-4 text-white cursor-pointer duration-200 ease-in-out">
        <CirclePlus size={20} />
        Tambah Kendaraan
      </DialogTrigger>

      <DialogContent>
        <DialogHeader className={"font-geist-sans"}>
          <DialogTitle>Tambah Kendaraan Baru</DialogTitle>
          <DialogDescription>
            Isi data kendaraan dengan lengkap.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 mt-4 font-geist-sans"
        >
          <div className="flex gap-4 w-full">
            <div className="w-40">
              <Label className="block text-sm font-medium text-slate-700">
                Foto
              </Label>
              <div className="mt-2 flex items-center gap-4">
                <Label htmlFor="foto">
                  {!preview ? (
                    <div className="rounded-sm w-18 h-18 text-neutral-400 border-2 flex items-center justify-center">
                      <ImagePlus />
                    </div>
                  ) : (
                    <Image
                      width={400}
                      height={400}
                      src={preview}
                      alt="preview"
                      className="w-28 h-20 object-cover rounded"
                    />
                  )}
                </Label>
                <Input
                  type="file"
                  accept="image/*"
                  id="foto"
                  className={"hidden"}
                  onChange={handleFileChange}
                  required
                />
              </div>
            </div>

            <div className="w-full space-y-2">
              <Label>Merek</Label>
              <Input
                type="text"
                value={merek}
                onChange={(e) => setMerek(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="w-full max-w-[440px]">
            <Label className="block text-sm font-medium text-slate-700">
              Deskripsi
            </Label>
            <Textarea
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="mt-2 w-full h-15"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="block text-sm font-medium text-slate-700">
                Jenis
              </Label>
              <Input
                type="text"
                value={jenis}
                onChange={(e) => setJenis(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="block text-sm font-medium text-slate-700">
                Transmisi
              </Label>
              <Select
                value={transmisi}
                onValueChange={setTransmisi}
                className="w-full"
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Manual" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manual">Manual</SelectItem>
                  <SelectItem value="Otomatis">Otomatis</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="block text-sm font-medium text-slate-700">
                Warna
              </Label>
              <Input
                type="text"
                value={warna}
                onChange={(e) => setWarna(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="block text-sm font-medium text-slate-700">
                Harga per hari (Rp)
              </Label>
              <Input
                type="number"
                value={hargaPerHari}
                onChange={(e) => setHargaPerHari(e.target.value)}
                min={0}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="block text-sm font-medium text-slate-700">
              Status
            </Label>
            <Select value={status} onValueChange={setStatus} className="w-full">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Tersedia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tersedia">Tersedia</SelectItem>
                <SelectItem value="Tidak tersedia">Tidak Tersedia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-end gap-3 mt-4">
            <button
              type="button"
              className="px-4 py-2 rounded border"
              onClick={() => {
                setFotoFile(null);
                setPreview(null);
                setMerek("");
                setDeskripsi("");
                setJenis("");
                setTransmisi("Manual");
                setWarna("");
                setHargaPerHari(0);
                setStatus("Tersedia");
              }}
            >
              Reset
            </button>
            <Button
              type="submit"
              className="bg-sky-600 text-white rounded"
              disabled={isLoading}
            >
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
