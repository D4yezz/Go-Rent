"use client";

import { useEffect, useState } from "react";
import { getProfileUser } from "@/service/auth.service";
import supabase from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User2 } from "lucide-react";

export default function PelangganView() {
  const [profile, setProfile] = useState(null);
  const [pemesanan, setPemesanan] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const user = await getProfileUser();
        if (!user || !user.status || !user.data) {
          setProfile(null);
          setPemesanan([]);
          return;
        }

        const prof = user.data.profile;
        setProfile(prof);

        const { data: pemesananData, error } = await supabase
          .from("pemesanan")
          .select(
            "id, kendaraan_id (id, merk), tanggal_mulai, tanggal_selesai, total_harga, status, created_at"
          )
          .eq("user_id", prof.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setPemesanan(pemesananData || []);
      } catch (err) {
        console.error(err);
        toast.error("Gagal memuat data pelanggan");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const totalPemesanan = pemesanan.length;
  const activePemesanan = pemesanan.filter(
    (p) => !["selesai", "menunggu", "dibatalkan"].includes(p.status)
  );

  return (
    <div className="grid md:grid-cols-3 gap-4 font-geist-sans">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Ringkasan Akun</CardTitle>
        </CardHeader>
        <CardContent>
          {profile ? (
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <span className="text-sky-600">
                  <User2 />
                </span>
                <p className=" text-transparent bg-cyan-sky bg-clip-text">
                  {profile.nama_lengkap || profile.username}
                </p>
              </h2>
              {profile.username && (
                <div className="text-sm text-slate-600">{profile.username}</div>
              )}
              {profile.email && (
                <div className="text-sm text-slate-600">{profile.email}</div>
              )}
            </div>
          ) : (
            <div>Tidak ada data akun</div>
          )}
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Riwayat Penyewaan</CardTitle>
          <CardDescription>
            Ringkasan penyewaan dan status aktif
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="p-4 bg-sky-50 rounded-lg flex-1">
              <div className="text-sm text-slate-500">Total Penyewaan</div>
              <div className="text-2xl font-bold">
                {loading ? "..." : totalPemesanan}
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg flex-1">
              <div className="text-sm text-slate-500">Penyewaan Aktif</div>
              <div className="text-2xl font-bold">
                {loading ? "..." : activePemesanan.length}
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Aktif / Terbaru</h4>
            {loading ? (
              <div>Memuat...</div>
            ) : pemesanan.length === 0 ? (
              <div className="text-sm text-slate-500">Belum ada penyewaan</div>
            ) : (
              <div className="space-y-3">
                {pemesanan.slice(0, 6).map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm"
                  >
                    <div>
                      <div className="font-medium">
                        {p.kendaraan_id?.merk || "-"}
                      </div>
                      <div className="text-sm text-slate-500">
                        {new Intl.DateTimeFormat("id-ID", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }).format(new Date(p.tanggal_mulai))}
                        <span className="mx-2">–</span>
                        {new Intl.DateTimeFormat("id-ID", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }).format(new Date(p.tanggal_selesai))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        Rp{" "}
                        {new Intl.NumberFormat("id-ID").format(p.total_harga)}
                      </div>
                      <Badge
                        className={`mt-1 capitalize ${
                          p.status === "menunggu"
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-cyan-sky"
                        }`}
                      >
                        {p.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
