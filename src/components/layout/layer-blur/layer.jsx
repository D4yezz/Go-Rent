"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

export default function LayerBlur() {
  const { scrollY } = useScroll();

  const yControl = useTransform(scrollY, [0, 400], [0, 80]);

  return (
    <div className="w-full h-full absolute top-0 left-0 z-0 overflow-hidden pointer-events-none">
      <motion.div style={{ y: yControl }} className="absolute left-10">
        <Image
          src="/kunci/5.png"
          width={1000}
          height={1000}
          className="w-60 h-60 blur-xs -rotate-80"
          alt="blur-layer"
        />
      </motion.div>

      <motion.div
        style={{ y: yControl }}
        className="absolute right-50 bottom-20"
      >
        <Image
          src="/kunci/5.png"
          width={1000}
          height={1000}
          className="w-50 h-50 blur-xs rotate-80"
          alt="blur-layer"
        />
      </motion.div>

      <motion.div style={{ y: yControl }} className="absolute right-10 top-40">
        <Image
          src="/kunci/7.png"
          width={1000}
          height={1000}
          className="w-30 h-30 blur-[1.5px] -rotate-20"
          alt="blur-layer"
        />
      </motion.div>

      <motion.div
        style={{ y: yControl }}
        className="absolute left-30 bottom-30"
      >
        <Image
          src="/kunci/6.png"
          width={1000}
          height={1000}
          className="w-40 h-40 blur-[1.5px] -rotate-30"
          alt="blur-layer"
        />
      </motion.div>
    </div>
  );
}
