"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

export default function LayerBlur() {
  const { scrollY } = useScroll();

  const yControl = useTransform(scrollY, [0, 400], [0, 80]);

  return (
    <div className="w-full h-full absolute top-0 left-0 z-0 overflow-hidden pointer-events-none">
      <motion.div style={{ y: yControl }} className="absolute lg:left-10 left-3 lg:top-0 top-10">
        <Image
          src="/kunci/5.png"
          width={1000}
          height={1000}
          className="lg:w-60 w-35 lg:h-60 h-35 blur-xs -rotate-80"
          alt="blur-layer"
        />
      </motion.div>

      <motion.div
        style={{ y: yControl }}
        className="absolute right-50 bottom-20 lg:visible invisible"
      >
        <Image
          src="/kunci/5.png"
          width={1000}
          height={1000}
          className="lg:w-50 lg:h-50 w-20 h-20 lg:blur-xs blur-[1px] lg:rotate-80 -rotate-12"
          alt="blur-layer"
        />
      </motion.div>

      <motion.div style={{ y: yControl }} className="absolute right-10 lg:top-40 top-80">
        <Image
          src="/kunci/7.png"
          width={1000}
          height={1000}
          className="lg:w-40 lg:h-40 w-25 h-25 blur-[2px] -rotate-20"
          alt="blur-layer"
        />
      </motion.div>

      <motion.div
        style={{ y: yControl }}
        className="absolute lg:left-30 left-5 lg:bottom-30 bottom-60"
      >
        <Image
          src="/kunci/6.png"
          width={1000}
          height={1000}
          className="lg:w-40 lg:h-40 w-25 h-25 lg:blur-[1.5px] blur-[1px] lg:-rotate-30 rotate-40"
          alt="blur-layer"
        />
      </motion.div>
    </div>
  );
}
