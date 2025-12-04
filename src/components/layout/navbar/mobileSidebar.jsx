"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCarRear } from "@fortawesome/free-solid-svg-icons";
import navigasi from "./navigasi";
import { Separator } from "@/components/ui/separator";

export default function MobileSidebar({ showBar, setShowBar, buttonRole }) {
  return (
    <AnimatePresence>
      {showBar && (
        <>
          <motion.div
            onClick={() => setShowBar(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black z-20"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className={`fixed top-0 right-0 bg-white h-dvh w-[78%] max-w-xs z-30 shadow-lg p-4`}
          >
            <button
              onClick={() => setShowBar(false)}
              className="absolute top-4 right-4 p-2 rounded-md hover:bg-slate-100 cursor-pointer text-sky-600"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-50 text-sky-600 rounded-md">
                <FontAwesomeIcon icon={faCarRear} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Go - Rent</h3>
                <p className="text-sm text-slate-500">
                  Sewa mobil mudah & cepat
                </p>
              </div>
            </div>
            <Separator className="my-4" />
            {/* <div className="py-1 w-full h-fit bg-gray-500"></div> */}
            <nav className="flex flex-col gap-3">
              {navigasi.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={() => setShowBar(false)}
                  className="px-3 py-2 rounded-md hover:bg-sky-100 border border-sky-600 shadow text-sky-600"
                >
                  {item.title}
                </Link>
              ))}
            </nav>

            <div className="mt-6 w-full flex items-center justify-center">
              {buttonRole()}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
