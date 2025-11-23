import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { faCarRear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import {
  ScanEye,
  X,
  Fuel,
  Palette,
  DollarSign,
  Check,
  AlertCircle,
  Car,
  Cog,
} from "lucide-react";
import Image from "next/image";
import React from "react";

export default function ViewKendaraan({ item, open, onOpenChange }) {
  if (!item) return null;

  const statusColor =
    item.status === "Tersedia"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  const statusIcon =
    item.status === "Tersedia" ? (
      <Check className="w-4 h-4" />
    ) : (
      <AlertCircle className="w-4 h-4" />
    );

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value || 0);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            onClick={() => onOpenChange(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 left-0 w-full h-dvh bg-black/30 z-40"
          />
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 right-0 z-50 flex flex-col lg:w-[60%] w-full h-dvh bg-white overflow-y-auto font-onest"
          >
            <div className="sticky top-0 flex items-center justify-between p-6 border-b bg-white z-10">
              <h2 className="text-2xl font-bold text-slate-900">
                Detail Kendaraan
              </h2>
              <button
                onClick={() => onOpenChange(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            <div className="flex-1 p-6 space-y-6">
              {item.foto_url && (
                <div className="relative w-full h-64 bg-slate-200 rounded-lg overflow-hidden">
                  <Image
                    src={item.foto_url}
                    alt={item.merek || "Kendaraan"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 60vw"
                  />
                </div>
              )}

              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${statusColor}`}
              >
                {statusIcon}
                <span className="font-medium text-sm">{item.status}</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-md bg-sky-100">
                    <FontAwesomeIcon
                      icon={faCarRear}
                      className="text-xl text-sky-600"
                    />
                  </span>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-medium text-slate-500">
                      Merek
                    </h3>
                    <p className="text-xl font-bold text-slate-900">
                      {item.merk || "-"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-md bg-cyan-sky text-white">
                      <Car />
                    </span>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-sm font-medium text-slate-500 mb-1">
                        Jenis
                      </h3>
                      <p className="text-lg text-slate-900 font-semibold">
                        {item.jenis || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Cog className="w-5 h-5 text-blue-600" />
                    <div>
                      <h3 className="text-sm font-medium text-slate-500">
                        Transmisi
                      </h3>
                      <p className="text-lg text-slate-900 font-semibold">
                        {item.transmisi || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-md border-2 border-sky-600">
                      <Palette className="text-sky-600" />
                    </span>
                    <div>
                      <h3 className="text-sm font-medium text-slate-500">
                        Warna
                      </h3>
                      <p className="text-lg text-slate-900 font-semibold">
                        {item.warna || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <div>
                      <h3 className="text-sm font-medium text-slate-500">
                        Harga per Hari
                      </h3>
                      <p className="text-lg text-slate-900 font-semibold">
                        {formatCurrency(item.harga_per_hari)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {item.deskripsi && (
                <div className="bg-slate-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-slate-700 mb-2">
                    Deskripsi
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    {item.deskripsi}
                  </p>
                </div>
              )}

              <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                <h3 className="text-sm font-medium text-slate-700">
                  Informasi Tambahan
                </h3>
                {item.created_at && (
                  <p className="text-xs text-slate-600">
                    <span className="font-medium">Ditambahkan:</span>{" "}
                    {new Date(item.created_at).toLocaleDateString("id-ID")}
                  </p>
                )}
                {item.id && (
                  <p className="text-xs text-slate-600">
                    <span className="font-medium">ID:</span> {item.id}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
