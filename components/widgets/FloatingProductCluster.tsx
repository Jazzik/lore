"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { FLOATING_IMAGES } from "@/lib/floatingImages";

type TileConfig = {
  left: string;
  top: string;
  rotate: number;
  size: number;
  floatDelay: number;
};

const CENTER = "50%";

const TILES: TileConfig[] = [
  { left: "20%", top: "16%", rotate: -7, size: 148, floatDelay: 0 },
  { left: "80%", top: "12%", rotate: 5, size: 128, floatDelay: 0.5 },
  { left: "10%", top: "58%", rotate: 4, size: 168, floatDelay: 1 },
  { left: "84%", top: "62%", rotate: -5, size: 138, floatDelay: 1.5 },
  { left: "48%", top: "86%", rotate: 7, size: 118, floatDelay: 2 },
  { left: "50%", top: "40%", rotate: -3, size: 108, floatDelay: 2.5 },
];

function Tile({
  src,
  config,
  progress,
}: {
  src: string;
  config: TileConfig;
  progress: MotionValue<number>;
}) {
  const { left, top, rotate, size, floatDelay } = config;
  const tileLeft = useTransform(progress, [0, 1], [CENTER, left]);
  const tileTop = useTransform(progress, [0, 1], [CENTER, top]);
  const scale = useTransform(progress, [0, 1], [0.5, 1]);
  const rotateZ = useTransform(progress, [0, 1], [0, rotate]);
  const opacity = useTransform(progress, [0, 0.3, 1], [0, 1, 1]);

  return (
    <motion.div
      className="absolute"
      style={{
        left: tileLeft,
        top: tileTop,
        x: "-50%",
        y: "-50%",
        scale,
        rotate: rotateZ,
        opacity,
        width: size,
        height: size,
      }}
    >
      <div
        className="relative h-full w-full overflow-hidden rounded-2xl shadow-xl shadow-black/40"
        style={{ animation: `floatObject 5.2s ease-in-out ${floatDelay}s infinite` }}
      >
        <Image
          src={src}
          alt=""
          fill
          unoptimized
          sizes={`${size}px`}
          className="object-cover"
        />
      </div>
    </motion.div>
  );
}

export function FloatingProductCluster() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.25"],
  });

  return (
    <div ref={ref} className="relative min-h-[420px] w-full" aria-hidden>
      {FLOATING_IMAGES.map((src, i) => (
        <Tile key={src} src={src} config={TILES[i]} progress={scrollYProgress} />
      ))}
    </div>
  );
}
