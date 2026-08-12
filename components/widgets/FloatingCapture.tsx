"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { useUIStore } from "@/store/ui";

export function FloatingCapture() {
  const t = useTranslations("floatingCapture");
  const titleLines = t.raw("titleLines") as string[];
  const activeSlide = useUIStore((state) => state.activeSlide);
  const dismissed = useUIStore((state) => state.floatingWidgetDismissed);
  const dismiss = useUIStore((state) => state.dismissFloatingWidget);
  const [sent, setSent] = useState(false);

  const visible = activeSlide > 0 && activeSlide < 8 && !dismissed;

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
            {/* real product photography swaps in here later */}
            <div
              className="absolute -left-2 bottom-4 h-[110px] w-[110px] rounded-md bg-gradient-to-br from-[#2a241e] to-[#3a3128] shadow-lg shadow-black/40"
              style={{ animation: "floatObject 4.8s ease-in-out infinite" }}
              aria-hidden
            />
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
            {sent ? (
              <p className="text-[11px] leading-relaxed text-muted-ink">
                {t("sent")}
              </p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="flex items-stretch border-b border-line"
              >
                <input
                  placeholder={t("placeholder")}
                  className="w-full min-w-0 border-0 bg-transparent py-2 text-[11px] outline-none"
                />
                <button
                  type="submit"
                  className="shrink-0 pl-3 text-[8px] uppercase tracking-[0.13em] text-foreground transition-colors hover:text-rose"
                >
                  {t("submit")}
                </button>
              </form>
            )}
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
