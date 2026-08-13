"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "@/lib/useInView";

export function VideoTile({
  src,
  caption,
  className = "",
}: {
  src: string;
  caption?: string;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {
      // autoplay rejected — tile stays on the paper backdrop
    });
  }, [inView]);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden bg-paper ${className}`}
    >
      {inView ? (
        <video
          ref={videoRef}
          src={src}
          loop
          muted
          playsInline
          preload="none"
          onPlaying={() => setIsPlaying(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            isPlaying ? "opacity-100" : "opacity-0"
          }`}
        />
      ) : null}
      {caption ? (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-8">
          <span className="text-[10px] uppercase tracking-[0.14em] text-foreground">
            {caption}
          </span>
        </div>
      ) : null}
    </div>
  );
}
