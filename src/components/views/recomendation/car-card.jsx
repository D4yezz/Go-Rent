"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProfileUser } from "@/service/auth.service";
import {
  faCarSide,
  faCircleCheck,
  faCircleXmark,
  faPalette,
  faUsb,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Cog, Palette, RefreshCcw, Usb } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CarCard({
  mobilId,
  merk,
  jenis,
  warna,
  harga_per_hari,
  status,
  transmisi,
  image,
  home = true,
  showForm,
  setShowForm,
}) {
  const [isLoading, SetIsLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const router = useRouter();
  const checkUserLogin = async () => {
    try {
      const user = await getProfileUser();

      if (user.status && user.data) {
        setIsLogin(true);
        setUserRole(user.data.profile.role);
      } else {
        setIsLogin(false);
        setUserRole(null);
      }
    } catch (error) {
      console.error("Error checking user login:", error);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      await checkUserLogin();
      SetIsLoading(false);
    };

    getUser();
  }, []);

  const handleButton = () => {
    if (isLogin) {
      if (userRole === "petugas" || userRole === "user") {
        // setSelectedMobilId(mobilId);
        setShowForm(mobilId);
      } else {
        toast.warning("Anda adalah admin");
        router.push("/admin/penyewaan");
      }
    } else {
      router.push("/auth/login");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <div className="relative h-78 bg-gray-200">
        <div className="text-[1rem] font-semibold w-28 flex items-center justify-center gap-2 py-1 text-sky-600 absolute bg-sky-50 rounded-md top-4 left-4">
          <span>
            <FontAwesomeIcon icon={faCarSide} />
          </span>
          <span>{jenis}</span>
        </div>
        <Image
          src={image || "/car-icon.png"}
          alt={merk}
          className="w-full h-full object-cover"
          width={1000}
          height={1000}
        />
      </div>
      <div className="p-4">
        <h3 className="text-2xl font-semibold text-gray-900">{merk}</h3>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-[1.1rem] w-28 flex items-center gap-2 text-sky-900">
            <span>
              <FontAwesomeIcon icon={faPalette} />
            </span>
            <span>{warna}</span>
          </div>
          <Badge
            variant={"outline"}
            className="bg-blue-100 text-sm text-sky-900 ring-sky-500"
          >
            <span>
              {transmisi === "Manual" ? (
                <Cog size={16} />
              ) : (
                <RefreshCcw size={16} />
              )}
            </span>
            <span>{transmisi}</span>
          </Badge>
        </div>
        <div
          className={`mt-2 flex items-center text-sm ${
            status === "Tersedia" ? "text-green-600" : "text-red-600"
          }`}
        >
          <span>
            {status === "Tersedia" ? (
              <FontAwesomeIcon icon={faCircleCheck} />
            ) : (
              <FontAwesomeIcon icon={faCircleXmark} />
            )}
          </span>
          <span className="ml-1">{status}</span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Harga per hari</span>
            <span className="text-xl font-bold text-sky-600">
              Rp {harga_per_hari.toLocaleString("id-ID")}
            </span>
          </div>
          <Button
            disabled={status === "Tidak tersedia"}
            onClick={() => (home ? router.push("/cars") : handleButton())}
            className="bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700 transition cursor-pointer"
          >
            Sewa Sekarang
          </Button>
        </div>
      </div>
    </div>
  );
}
