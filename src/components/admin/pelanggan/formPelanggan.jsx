"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Eye, EyeOff, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { registerUser } from "@/service/auth.service";

export default function FormPelanggan({ onSuccess }) {
  const TABLE = "users";
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [namaLengkap, setNamaLengkap] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [noHp, setNoHp] = useState("");
  const [role, setRole] = useState("user");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!username || !email) {
        toast.error("Username dan email wajib diisi");
        return;
      }

      const authRes = await registerUser({
        email: email.trim(),
        password: password,
        confirm_password: password,
        username: username,
        no_hp: noHp,
      });

      if (!authRes.status) {
        toast.error("Gagal register auth: " + authRes.pesan);
        return;
      }

      // const userId = authRes.data.user.id;

      // const payload = {
      //   id: userId,
      //   username,
      //   nama_lengkap: namaLengkap,
      //   email: email.trim(),
      //   no_hp: noHp,
      //   role,
      // };

      // const { data, error } = await supabase.from(TABLE).insert([payload]);
      // if (error) throw error;

      toast.success("Pelanggan berhasil ditambahkan");
      setOpen(false);

      setUsername("");
      setNamaLengkap("");
      setEmail("");
      setNoHp("");
      setRole("user");

      if (typeof onSuccess === "function") onSuccess(data);
    } catch (err) {
      console.error(err);
      toast.error(
        "Gagal menambahkan pelanggan: " + (err.message || JSON.stringify(err))
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-cyan-sky text-white rounded-md">
          <PlusCircle size={20} /> Tambah Pelanggan
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg font-rethink">
        <DialogHeader>
          <DialogTitle>Tambah Pelanggan Baru</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 mt-4 font-instrument-sans"
        >
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
            <label className="block text-sm text-slate-600">No. HP</label>
            <input
              type="number"
              value={noHp}
              onChange={(e) => setNoHp(e.target.value)}
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
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Kata Sandi
            </label>
            <InputGroup>
              <InputGroupInput
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
              onClick={() => setOpen(false)}
              className="px-4 py-2 rounded border"
            >
              Batal
            </button>
            <Button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 rounded bg-sky-600 text-white"
            >
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
