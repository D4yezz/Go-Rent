import { useEffect, useState } from "react";
import CarCard from "./car-card";
import supabase from "@/lib/supabase/client";
import { CircleArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import useMediaQuery from "@/hooks/useMediaQuery";

export default function CarRecommendations() {
  const [mobil, setMobil] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isDekstop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    const getMobil = async () => {
      try {
        const { data, error } = await supabase.from("kendaraan").select("*");
        if (error) {
          setError(error?.message || null);
        } else {
          setMobil(data || []);
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getMobil();
  }, []);

  return (
    <section className="w-full mx-auto lg:px-12 px-4 py-12 font-geist-sans">
      <div className="mb-8 w-full flex items-center justify-between lg:gap-0 gap-8">
        <div className="flex flex-col">
          <h2 className="lg:text-4xl text-2xl font-bold bg-cyan-sky bg-clip-text text-transparent">
            Rekomendasi Kendaraan
          </h2>
          <p className="mt-2 text-gray-600">
            Pilih dari kendaraan terbaik kami yang siap memenuhi kebutuhan
            perjalanan Anda
          </p>
        </div>
        <Link
          href="/cars"
          className="flex items-center gap-2 text-sky-600 lg:text-lg"
        >
          {isDekstop ? (
            <CircleArrowRight size={20} />
          ) : (
            <CircleArrowRight size={30} />
          )}{" "}
          Semua Kendaraan
        </Link>
      </div>

      {loading ? (
        <p className="text-center text-gray-600 flex items-center justify-center gap-2 w-full">
          <Loader2 className="animate-spin" /> Loading...
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mobil.slice(0, 3).map((car) => (
            <CarCard
              key={car.id}
              merk={car.merk}
              jenis={car.jenis}
              warna={car.warna}
              harga_per_hari={car.harga_per_hari}
              status={car.status}
              transmisi={car.transmisi}
              image={car.foto_url}
            />
          ))}
        </div>
      )}
      {error && <p className="text-center text-red-600">{error}</p>}
    </section>
  );
}
