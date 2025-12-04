"use client";
import LayerBlur from "@/components/layout/layer-blur/layer";
import { faCarRear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function TeksWelcome() {
  return (
    <section className="w-full lg:px-12 px-6 lg:mt-16 mt-6 flex flex-col items-center justify-center font-schibsted-grotesk relative">
      <div className="flex flex-col items-center text-center gap-2 z-10">
        <h1 className="lg:text-7xl text-4xl lg:font-semibold font-bold lg:w-5xl bg-cyan-sky bg-clip-text text-transparent py-2">
          Selamat Datang Website Penyewaan Mobil Terpercaya
        </h1>
        <p className="lg:text-xl text-lg text-sky-900 font-medium text-balance lg:w-2xl">
          Go-Rent adalah website penyewaan mobil terpercaya di Indonesia,
          memudahkan Anda untuk menyewa mobil dengan mudah dan cepat.
        </p>
      </div>
      <div className="flex items-center gap-4 lg:mt-12 mt-6">
        <Link href={"/cars"} className="flex items-center gap-2 bg-cyan-sky p-2 rounded-full cursor-pointer hover:shadow-lg hover:scale-105 duration-300 ease-in-out">
          <span className="rounded-full px-2.5 py-2 text-lg bg-white text-sky-600">
            <FontAwesomeIcon icon={faCarRear} />
          </span>
          <p className="font-semibold text-white pr-2">Sewa Sekarang</p>
        </Link>
        <Link href={"/#kontak"} className="flex items-center gap-2 bg-white ring ring-sky-600 p-2 rounded-full cursor-pointer hover:shadow-lg hover:scale-105 duration-300 ease-in-out">
          <p className="font-semibold text-sky-600 pl-2">Hubungi</p>
          <span className="rounded-full p-2 bg-cyan-sky text-white">
            <Phone size={20} />
          </span>
        </Link>
      </div>
      <div className="w-full h-fit flex items-center justify-center z-10">
        <Image
          src="/car/welcome.png"
          alt="welcome"
          width={1000}
          height={1000}
          className="h-fit lg:w-1/2"
        />
      </div>
      <LayerBlur />
    </section>
  );
}
