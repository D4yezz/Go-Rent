import { Badge } from "@/components/ui/badge";
import {
  faCarSide,
  faCircleCheck,
  faCircleXmark,
  faUsb,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Cog, RefreshCcw, Usb } from "lucide-react";
import Image from "next/image";

export default function CarCard({
  // id,
  merk,
  jenis,
  harga_per_hari,
  status,
  transmisi,
  image,
}) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <div className="relative h-78 bg-gray-200">
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
          <div className="text-[1rem] w-28 flex items-center gap-2 text-sky-600">
            <span>
              <FontAwesomeIcon icon={faCarSide} />
            </span>
            <span>{jenis}</span>
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
          <button className="bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700 transition cursor-pointer">
            Pesan Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
