"use client";

import React from "react";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  DollarSign,
  User,
  Car,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import Image from "next/image";

export default function DetailPenyewaan({ item }) {
  if (!item) return null;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateString));
  };

  const getStatusBadge = (status) => {
    const styles = {
      selesai: "bg-green-100 text-green-800 border border-green-300",
      menunggu: "bg-yellow-100 text-yellow-800 border border-yellow-300",
      batal: "bg-red-100 text-red-800 border border-red-300",
    };

    const labels = {
      selesai: "Selesai",
      menunggu: "Menunggu",
      batal: "Dibatalkan",
    };

    return {
      style: styles[status] || styles.pending,
      label: labels[status] || status,
    };
  };

  const calculateDays = () => {
    const start = new Date(item.tanggal_mulai);
    const end = new Date(item.tanggal_selesai);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  const statusInfo = getStatusBadge(item.status);
  const days = calculateDays();
  console.log(item);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl">Detail Penyewaan</DialogTitle>
        <DialogDescription>
          Informasi lengkap tentang pesanan penyewaan kendaraan
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6 max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">
            Status Pesanan
          </span>
          <Badge className={statusInfo.style}>{statusInfo.label}</Badge>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Informasi Pelanggan
          </h3>
          <div className="space-y-3 pl-7">
            <div>
              <p className="text-sm text-slate-600">Nama</p>
              <p className="font-medium text-slate-900">
                {item.user_id?.username || item.user_id?.name || "-"}
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Car className="w-5 h-5 text-sky-600" />
            Informasi Kendaraan
          </h3>
          <div className="space-y-3 pl-7">
            {item.kendaraan_id?.foto_url && (
              <div className="relative w-full h-32 rounded-lg overflow-hidden mb-3">
                <Image
                  src={item.kendaraan_id.foto_url}
                  alt={item.kendaraan_id.merk}
                  fill
                  className="object-cover"
                  sizes="100%"
                />
              </div>
            )}
            <div>
              <p className="text-sm text-slate-600">Merek Kendaraan</p>
              <p className="font-bold text-lg text-slate-900">
                {item.kendaraan_id?.merk || "-"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600">Jenis</p>
                <p className="font-medium text-slate-900">
                  {item.kendaraan_id?.jenis || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Transmisi</p>
                <p className="font-medium text-slate-900">
                  {item.kendaraan_id?.transmisi || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Warna</p>
                <p className="font-medium text-slate-900">
                  {item.kendaraan_id?.warna || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Harga/Hari</p>
                <p className="font-medium text-sky-600">
                  {formatCurrency(item.kendaraan_id?.harga_per_hari || 0)}
                </p>
              </div>
            </div>
            {item.kendaraan_id?.deskripsi && (
              <div className="bg-slate-50 rounded p-3">
                <p className="text-sm text-slate-600">Deskripsi</p>
                <p className="text-sm text-slate-700 line-clamp-3">
                  {item.kendaraan_id.deskripsi}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Tanggal & Durasi Sewa
          </h3>
          <div className="space-y-3 pl-7">
            <div>
              <p className="text-sm text-slate-600">Tanggal Mulai</p>
              <p className="font-medium text-slate-900">
                {formatDate(item.tanggal_mulai)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Tanggal Selesai</p>
              <p className="font-medium text-slate-900">
                {formatDate(item.tanggal_selesai)}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 mt-2">
              <p className="text-sm text-slate-600">Durasi Sewa</p>
              <p className="text-lg font-bold text-purple-600">{days} hari</p>
            </div>
          </div>
        </div>

        {/* Informasi Harga */}
        <div className="border-t pt-4">
          <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Detail Harga
          </h3>
          <div className="space-y-3 pl-7 bg-slate-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Harga per Hari</span>
              <span className="font-medium">
                {formatCurrency(item.kendaraan_id?.harga_per_hari || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Jumlah Hari</span>
              <span className="font-medium">{days} hari</span>
            </div>
            <div className="border-t border-slate-200 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-900">
                  Total Harga
                </span>
                <span className="text-xl font-bold text-green-600">
                  {formatCurrency(item.total_harga)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Informasi Tambahan */}
        {(item.created_at || item.id) && (
          <div className="border-t pt-4">
            <h3 className="font-semibold text-slate-900 mb-3">
              Informasi Sistem
            </h3>
            <div className="space-y-2 text-xs text-slate-500 pl-4">
              {item.created_at && (
                <p>
                  <span className="font-medium">Dibuat:</span>{" "}
                  {formatDate(item.created_at)}
                </p>
              )}
              {item.id && (
                <p>
                  <span className="font-medium">ID Pesanan:</span> {item.id}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
