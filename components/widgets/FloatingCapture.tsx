"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { useUIStore } from "@/store/ui";
import { ROTATING_CAPTURE_IMAGES } from "@/lib/rotatingCaptureImages";
import { SLIDE_IDS } from "@/lib/sections";
import { useLeadSubmit } from "@/components/forms/useLeadSubmit";

export function FloatingCapture() {
  const t = useTranslations("floatingCapture");
  const titleLines = t.raw("titleLines") as string[];
  const activeSlide = useUIStore((state) => state.activeSlide);
  const dismissed = useUIStore((state) => state.floatingWidgetDismissed);
  const dismiss = useUIStore((state) => state.dismissFloatingWidget);
  const [imageIndex, setImageIndex] = useState(0);
  const [handle, setHandle] = useState("");
  const [hp, setHp] = useState("");
  const { submit, status, errorCode } = useLeadSubmit();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    submit({
      name: "Без имени",
      contact: handle,
      message: "",
      channel: "telegram",
      source: "floating-capture",
      hp,
    });
  }

  const contactSlideIndex = SLIDE_IDS.indexOf("contact");
  const visible = activeSlide > 0 && activeSlide < contactSlideIndex && !dismissed;

  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => {
      setImageIndex((i) => (i + 1) % ROTATING_CAPTURE_IMAGES.length);
    }, 3200);
    return () => clearInterval(id);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.aside
          initial={{ opacity: 0, y: 38, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 25, scale: 0.97 }}
          transition={{ duration: 0.6, ease: [0.22, 0.7, 0.18, 1] }}
          className="fixed bottom-6 right-6 z-40 w-[min(360px,calc(100vw-2rem))]"
          aria-label="Create your next product"
        >
          <div className="relative rounded-sm border border-line bg-paper/95 p-6 pb-5 pl-24 shadow-2xl shadow-black/40 backdrop-blur-md">
            <div
              className="absolute -left-4 bottom-4 h-[110px] w-[110px]"
              style={{ animation: "floatObject 4.8s ease-in-out infinite" }}
              aria-hidden
            >
              <AnimatePresence mode="sync">
                <motion.div
                  key={imageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={ROTATING_CAPTURE_IMAGES[imageIndex]}
                    alt=""
                    fill
                    sizes="110px"
                    className="object-contain drop-shadow-lg"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <button
              type="button"
              onClick={dismiss}
              className="absolute right-3 top-3 text-xs text-muted-ink transition-colors hover:text-foreground"
              aria-label="Dismiss"
            >
              ✕
            </button>
            <p className="mb-2 text-[8px] uppercase tracking-[0.18em] text-muted-ink">
              {t("eyebrow")}
            </p>
            <h3 className="mb-4 font-serif text-xl leading-[0.95]">
              {titleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
              <em className="italic text-rose">{t("titleAccent")}</em>
            </h3>
            {status === "success" ? (
              <p role="status" aria-live="polite" className="text-[11px] leading-relaxed text-muted-ink">
                {t("sent")}
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="flex items-stretch border-b border-line">
                <input
                  type="text"
                  name="lore_hp_ref"
                  value={hp}
                  onChange={(e) => setHp(e.target.value)}
                  tabIndex={-1}
                  autoComplete="new-password"
                  data-1p-ignore=""
                  aria-hidden
                  className="pointer-events-none absolute h-0 w-0 opacity-0"
                />
                <input
                  placeholder={t("placeholder")}
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  required
                  className="w-full min-w-0 border-0 bg-transparent py-2 text-[11px] outline-none"
                />
                <button
                  type="submit"
                  disabled={status === "pending"}
                  className="shrink-0 pl-3 text-[8px] uppercase tracking-[0.13em] text-foreground transition-colors hover:text-rose disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {status === "pending" ? t("submitting") : t("submit")}
                </button>
              </form>
            )}
            {status === "error" ? (
              <p role="alert" aria-live="assertive" className="mt-2 text-[10px] leading-relaxed text-rose">
                {errorCode === "rate_limited" ? t("errorRateLimited") : t("error")}
              </p>
            ) : null}
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
