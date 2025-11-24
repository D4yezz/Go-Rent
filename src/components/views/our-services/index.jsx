import { faCalendarCheck, faCarRear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BrushCleaning, CalendarCheck } from "lucide-react";
import Image from "next/image";

export default function OurService() {
  return (
    <section id="service" className="w-full mx-auto px-12 py-12 font-onest">
      <h1 className="text-5xl py-2 font-bold bg-cyan-sky bg-clip-text text-transparent w-full text-center my-12 font-geist-sans">
        Layanan Kami
      </h1>
      <div className="flex flex-col gap-4 w-full h-[140vh] rounded-lg overflow-hidden shadow-lg">
        <div className="flex items-center gap-4 h-1/2">
          <div className="flex flex-col justify-center gap-3 w-[40%] h-full bg-cyan-sky p-12">
            <h2 className="text-white font-semibold text-2xl">
              Sewa Mobil Harian
            </h2>
            <p className="text-white text-balance">
              Nikmati perjalanan lebih fleksibel dan nyaman dengan layanan sewa
              mobil harian dari Go-Rent. Cocok buat jalan-jalan, kebutuhan
              mendadak, atau aktivitas harian kamu. Booking mudah, proses cepat,
              dan harga tetap ramah dompet.
            </p>
            <div className="flex items-center gap-2 font-bold text-lg mt-8 bg-white text-sky-600 py-2 pr-4 pl-2 rounded-r-full w-fit">
              <FontAwesomeIcon icon={faCalendarCheck} />
              <p>Daily</p>
            </div>
          </div>
          <div className="w-[60%] h-full">
            <Image
              src="/our-services/4.jpg"
              alt="our-service"
              width={1000}
              height={1000}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="flex items-center gap-4 h-1/2">
          <div className="w-[60%] h-full">
            <Image
              src="/our-services/1.jpg"
              alt="our-service"
              width={1000}
              height={1000}
              className="w-full h-full object-cover object-bottom"
            />
          </div>
          <div className="flex flex-col justify-center gap-3 w-[40%] h-full bg-cyan-sky p-12">
            <h2 className="text-white font-semibold text-2xl">
              Armada Selalu Terawat dan Bersih
            </h2>
            <p className="text-white text-balance">
              Setiap mobil selalu dicek, dibersihkan, dan dirawat secara rutin.
              Jadi kamu bakal dapet pengalaman nyetir yang nyaman, aman, dan
              bebas khawatir.
            </p>
            <div className="flex items-center gap-2 font-bold text-lg mt-8 bg-white text-sky-600 py-2 pr-4 pl-2 rounded-r-full w-fit">
              <BrushCleaning
                fill="oklch(58.8% 0.158 241.966)"
                strokeWidth="1"
                stroke="white"
              />
              <p>Clean</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
