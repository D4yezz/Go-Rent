"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCarRear } from "@fortawesome/free-solid-svg-icons";
import { LogIn } from "lucide-react";
import Link from "next/link";
import navigasi from "./navigasi";

export default function Navbar() {
  return (
    <header className="w-full bg-white font-geist-sans p-4">
      <nav className="max-w-7xl mx-auto p-2 bg-cyan-sky rounded-lg flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center space-x-3 h-full w-fit group"
        >
          <div className="p-2 bg-sky-50 text-sky-600 text-xl rounded-md">
            <FontAwesomeIcon
              icon={faCarRear}
              className="duration-500 ease-in-out group-hover:animate-bounce"
            />
          </div>
          <span className="text-xl font-semibold text-blue-50">Go - Rent</span>
        </Link>

        <div className="flex items-center text-white gap-6">
          {navigasi.map((item) => (
            <Link
              href={item.href}
              key={item.title}
              className="hover:bg-white hover:text-blue-500 px-4 py-1 rounded-lg duration-200 ease-in-out"
            >
              {item.title}
            </Link>
          ))}
        </div>

        <Link
          href="/auth/login"
          className="bg-white text-blue-500 hover:bg-blue-100 font-semibold px-4 py-2 w-fit h-full rounded-md cursor-pointer flex items-center gap-2"
        >
          <LogIn size={20} />
          Login
        </Link>
      </nav>
    </header>
  );
}
