"use client";

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

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden bg-paper ${className}`}
    >
      {inView ? (
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          className="absolute inset-0 h-full w-full object-cover"
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
