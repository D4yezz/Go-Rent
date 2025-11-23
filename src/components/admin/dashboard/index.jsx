import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { faCarOn, faCarRear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { KeySquare, TrendingDown, TrendingUp, UsersRound } from "lucide-react";
import React from "react";

export default function DashboardView() {
  const data = [
    {
      icon: <FontAwesomeIcon icon={faCarRear} className="text-xl" />,
      title: "Total Kendaraan",
      value: "100",
      desc: "Semua Jenis Kendaraan",
    },
    {
      icon: <KeySquare size={20} />,
      title: "Total Pemesanan",
      value: "10",
      desc: "Permintaan dari pengguna",
    },
    {
      icon: <UsersRound size={20} />,
      title: "Pengguna Terdaftar",
      value: "20",
      desc: "Semua Pengguna",
    },
    {
      icon: <FontAwesomeIcon icon={faCarOn} className="text-xl" />,
      title: "Disewakan",
      value: "14",
      desc: "Kendaraan sedang disewa",
    },
  ];
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
