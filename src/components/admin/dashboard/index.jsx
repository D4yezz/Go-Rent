"use client";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import supabase from "@/lib/supabase/client";
import { toast } from "sonner";
import { faCarOn, faCarRear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { KeySquare, TrendingDown, TrendingUp, UsersRound } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function DashboardView({ role = "admin" }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const [
          { data: kd, count: kdCount, error: kdErr },
          { data: pm, count: pmCount, error: pmErr },
          { data: us, count: usCount, error: usErr },
        ] = await Promise.all([
          supabase.from("kendaraan").select("id", { count: "exact" }),
          supabase.from("pemesanan").select("id", { count: "exact" }),
          supabase.from("users").select("id", { count: "exact" }),
        ]);

        const {
          data: sewaData,
          count: sewaCount,
          error: sewaErr,
        } = await supabase
          .from("kendaraan")
          .select("id", { count: "exact" })
          .eq("status", "Tidak tersedia");

        if (kdErr || pmErr || usErr || sewaErr) {
          toast.error("Terjadi kesalahan saat mengambil data statistik");
          return;
        }

        const totalKendaraan =
          typeof kdCount === "number" ? kdCount : (kd || []).length;
        const totalPemesanan =
          typeof pmCount === "number" ? pmCount : (pm || []).length;
        const totalUsers =
          typeof usCount === "number" ? usCount : (us || []).length;
        const totalDisewa =
          typeof sewaCount === "number" ? sewaCount : (sewaData || []).length;
        role === "admin"
          ? setData([
              {
                title: "Kendaraan",
                value: totalKendaraan,
                desc: "Total semua kendaraan",
                icon: <FontAwesomeIcon icon={faCarOn} size="xl" />,
              },
              {
                title: "Penyewaan",
                value: totalPemesanan,
                desc: "Total penyewaan kendaraan",
                icon: <KeySquare size={24} />,
              },
              {
                title: "Pengguna",
                value: totalUsers,
                desc: "Total pengguna",
                icon: <UsersRound size={24} />,
              },
              {
                title: "Sedang Disewa",
                value: totalDisewa,
                desc: "Kendaraan sedang beroperasi",
                icon: <FontAwesomeIcon icon={faCarRear} size="xl" />,
              },
            ])
          : setData([
              {
                title: "Kendaraan",
                value: totalKendaraan,
                desc: "Total kendaraan",
                icon: <FontAwesomeIcon icon={faCarOn} size="xl" />,
              },
              {
                title: "Sedang Disewa",
                value: totalDisewa,
                desc: "Kendaraan sedang beroperasi",
                icon: <FontAwesomeIcon icon={faCarRear} size="xl" />,
              },
            ]);
      } catch (err) {
        console.error(err);
        toast.error("Gagal memuat statistik");
      }
    };
    getData();
  }, [role]);

  console.log(data);

  return (
    <div className="grid lg:grid-cols-2 grid-col-1 items-center gap-4 font-rethink">
      {data.map((item, index) => {
        return (
          <Card
            key={index}
            className="w-full border-sky-500 shadow-md hover:shadow-lg text-sky-800"
          >
            <CardHeader className="justify-center items-center flex w-full gap-2">
              {item.icon}
              <h2 className="text-lg">{item.title}</h2>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-2">
              <span className="text-3xl font-bold">{item.value}</span>
              <CardDescription>{item.desc}</CardDescription>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
