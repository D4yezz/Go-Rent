"use client";

import supabase from "@/lib/supabase/client";
import { faCar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CarCard from "../recomendation/car-card";
import { AnimatePresence } from "framer-motion";
import FormCar from "./formCar";
import { Skeleton } from "@/components/ui/skeleton";

export default function AllCars() {
  const [mobil, setMobil] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedMobilId, setSelectedMobilId] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getMobil = async () => {
      try {
        const { data, error } = await supabase.from("kendaraan").select("*");
        if (error) {
          toast.error(error?.message || null);
        } else {
          setMobil(data || []);
        }
        setLoading(false);
      } catch (error) {
        toast.error(error);
      }
    };
    getMobil();
  }, []);
  return (
    <section className="w-full mx-auto lg:px-12 px-4 py-12 font-onest space-y-4">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex gap-2 items-center">
          <h1 className="text-5xl font-bold bg-cyan-sky bg-clip-text text-transparent">
            Semua Mobil
          </h1>
          <FontAwesomeIcon icon={faCar} className="text-4xl text-sky-600" />
        </div>
        <p className="text-sky-900 text-lg">
          Kami memiliki berbagai macam mobil yang sesuai dengan kebutuhan Anda.
          Silakan pilih mobil yang ingin Anda sewa.
        </p>
      </div>
      {loading ? (
        <Skeleton className={"w-full h-[400px]"} />
      ) : (
        <div className="grid lg:grid-cols-3 grid-cols-1 lg:gap-4 gap-8 py-4">
          {mobil.map((item) => (
            <CarCard
              key={item.id}
              mobilId={item.id} // Tambahkan ini
              merk={item.merk}
              jenis={item.jenis}
              warna={item.warna}
              harga_per_hari={item.harga_per_hari}
              status={item.status}
              transmisi={item.transmisi}
              image={item.foto_url}
              home={false}
              showForm={showForm}
              setShowForm={setShowForm}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm ? (
          <FormCar
            showForm={showForm}
            setShowForm={setShowForm}
            idMobil={showForm}
          />
        ) : null}
      </AnimatePresence>
    </section>
  );
}
