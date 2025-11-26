"use client";

import { useEffect, useState } from "react";
import { getProfileUser, UpdatePassword } from "@/service/auth.service";
import supabase from "@/lib/supabase/client";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Eye, EyeOff, ImagePlus } from "lucide-react";

export default function SettingsAcc() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    nama_lengkap: "",
    username: "",
    no_hp: "",
    password: "",
    foto_url: "",
  });

  const [photoFile, setPhotoFile] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const user = await getProfileUser();
        if (!user || !user.status || !user.data) {
          setProfile(null);
          return;
        }
        const p = user.data.profile;
        setProfile(p);
        setForm((f) => ({
          ...f,
          nama_lengkap: p.nama_lengkap || "",
          username: p.username || "",
          no_hp: p.no_hp || "",
          foto_url: p.foto_url || "",
        }));
      } catch (err) {
        console.error(err);
        toast.error("Gagal memuat profil");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const deleteOldPhoto = async (userId, oldUrl) => {
    if (!oldUrl) return;

    const path = oldUrl.split("/storage/v1/object/public/rental/")[1];
    if (!path) return;

    await supabase.storage.from("rental").remove([path]);
  };

  const uploadPhoto = async (userId, file) => {
    if (!file) return null;

    const ext = file.name.split(".").pop();
    const fileName = `profile_${Date.now()}.${ext}`;
    const path = `profile/${userId}/${fileName}`;

    const { error } = await supabase.storage
      .from("rental")
      .upload(path, file, { upsert: true });

    if (error) {
      console.error(error);
      toast.error("Upload foto gagal");
      return null;
    }

    const { data } = supabase.storage.from("rental").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    try {
      let fotoUrl = profile.foto_url;

      if (photoFile) {
        await deleteOldPhoto(profile.id, profile.foto_url);
        const newUrl = await uploadPhoto(profile.id, photoFile);
        if (newUrl) {
          fotoUrl = newUrl;
          setForm((prev) => ({ ...prev, foto_url: newUrl }));
        }
      }

      const payload = {
        username: form.username,
        nama_lengkap: form.nama_lengkap,
        no_hp: form.no_hp,
        foto_url: fotoUrl,
      };

      const { error } = await supabase
        .from("users")
        .update(payload)
        .eq("id", profile.id);

      if (error) throw error;

      if (form.password) {
        const res = await UpdatePassword(form.password);

        if (!res.status) {
          toast.error(res.pesan || "Gagal mengubah password");
        } else {
          toast.success("Password berhasil diubah");
        }
      }

      toast.success("Profil berhasil diperbarui");
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan perubahan");
    } finally {
      setSaving(false);
    }
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setPhotoFile(f);
      const url = URL.createObjectURL(f);
      setForm((s) => ({ ...s, foto_url: url }));
    }
  };

  return (
    <form
      onSubmit={handleSave}
      className="grid md:grid-cols-3 gap-6 font-schibsted-grotesk"
    >
      <div className="md:col-span-1">
        <div className="flex flex-col items-center gap-4 h-full">
          <Label
            htmlFor="avatar"
            className="w-full h-full relative rounded-xl overflow-hidden group cursor-pointer border-2 border-sky-600"
          >
            {form.foto_url ? (
              <>
                <Image
                  fill
                  src={form.foto_url || "/profile-kosong/2.jpg"}
                  alt="avatar"
                  className="object-cover group-hover:scale-105 group-hover:blur-[3px] transition-all duration-300 ease-in-out"
                />
                <span className="absolute z-10 mx-auto w-full h-full flex items-center justify-center translate-y-2/3 group-hover:translate-0 duration-300 ease-in-out">
                  <span className="bg-cyan-sky p-4 rounded-full text-white">
                    <ImagePlus size={34} />
                  </span>
                </span>
              </>
            ) : (
              <>
                <div className="w-full h-full items-center justify-center flex">
                  <span className="bg-cyan-sky p-4 rounded-full text-white">
                    <ImagePlus size={34} />
                  </span>
                </div>
              </>
            )}
          </Label>
          <Input
            type="file"
            id="avatar"
            accept="image/*"
            onChange={handleFile}
            className={"hidden"}
          />
        </div>
      </div>

      <div className="md:col-span-2 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nama Lengkap</Label>
            <Input
              placeholder="Nama lengkap anda"
              value={form.nama_lengkap}
              onChange={(e) => handleChange("nama_lengkap", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Username</Label>
            <Input
              value={form.username}
              onChange={(e) => handleChange("username", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>No HP</Label>
          <Input
            value={form.no_hp}
            onChange={(e) => handleChange("no_hp", e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Ganti Kata Sandi
          </label>
          <InputGroup>
            <InputGroupInput
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
            <InputGroupAddon>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                aria-label={
                  showPassword
                    ? "Sembunyikan kata sandi"
                    : "Tampilkan kata sandi"
                }
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </InputGroupAddon>
          </InputGroup>
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            type="submit"
            disabled={saving}
            className={"bg-cyan-sky cursor-pointer"}
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => window.location.reload()}
          >
            Batal
          </Button>
        </div>
      </div>
    </form>
  );
}
