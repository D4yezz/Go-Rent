import React from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

const menu = [
  {
    title: "Beranda",
    href: "/",
  },
  {
    title: "Layanan Kami",
    href: "/#service",
  },
  {
    title: "Sewa Mobil",
    href: "/cars",
  },
  {
    title: "Kontak",
    href: "#",
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="kontak" className="bg-sky-800 text-sky-100 mt-20 font-rethink">
      <div className="container mx-auto px-4 py-16">
        <div className="flex lg:flex-row flex-col items-start justify-between gap-8 lg:mb-12 mb-8">
          <div className="pr-4 h-full lg:w-[30%] w-full">
            <h3 className="text-xl font-bold mb-4 text-white">Tentang Kami</h3>
            <p className="text-sky-200 text-[1rem] leading-relaxed">
              Kami menyediakan layanan penyewaan mobil terbaik dengan mobil
              terkini dan profesional yang terjamin kenyamanan.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Menu Cepat</h3>
            <ul className="space-y-2">
              {menu.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className="text-sky-200 hover:text-white transition-colors text-sm"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Hubungi Kami</h3>
            <ul className="space-y-3 text-sky-200">
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 shrink-0 mt-0.5" />
                <span className="text-sm">(62) 812-3xxx-7xxx</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 shrink-0 mt-0.5" />
                <span className="text-sm break-all">
                  info@gorent.com
                </span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-5 h-5 shrink-0 mt-0.5" />
                <span className="text-sm">
                  Jl. Ujian Unit Kompetensi No. XII B, Malang
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-sky-200 lg:py-8 py-4"></div>

        <div className="flex items-center justify-center w-full">
          <p className="text-sky-300 text-sm">
            &copy; {currentYear} Go - Rent. Semua hak dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
