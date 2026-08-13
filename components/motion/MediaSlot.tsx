"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Renders real media the moment `src` is supplied, fading in only once it's
 * actually ready (same pattern as VideoTile — no black-frame flash). Until
 * then it shows an honest "coming soon" placeholder instead of a fake photo.
 */
export function MediaSlot({
  src,
  kind = "image",
  label,
  className = "",
  children,
}: {
  src?: string;
  kind?: "image" | "video";
  label?: string;
  className?: string;
  children?: ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (kind !== "video" || !src) return;
    videoRef.current?.play().catch(() => {});
  }, [kind, src]);

  return (
    <div className={`relative overflow-hidden bg-paper ${className}`}>
      {src ? (
        kind === "video" ? (
          <video
            ref={videoRef}
            src={src}
            loop
            muted
            playsInline
            onPlaying={() => setReady(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              ready ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt=""
            onLoad={() => setReady(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              ready ? "opacity-100" : "opacity-0"
            }`}
          />
        )
      ) : null}
      {!ready ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          {children}
          {label ? (
            <span className="text-[9px] uppercase tracking-[0.14em] text-muted-ink">
              {label}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
