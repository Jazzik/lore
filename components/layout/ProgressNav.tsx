"use client";

import { useTranslations } from "next-intl";
import { useUIStore } from "@/store/ui";
import { SLIDE_IDS } from "@/lib/sections";
import { scrollToSection } from "@/lib/scrollToSection";

export function ProgressNav() {
  const t = useTranslations("progress");
  const activeSlide = useUIStore((state) => state.activeSlide);
  const progress = (activeSlide / (SLIDE_IDS.length - 1)) * 100;

  return (
    <>
      <nav
        aria-label={t("label")}
        className="fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-2 md:flex"
      >
        {SLIDE_IDS.map((id, index) => (
          <button
            key={id}
            type="button"
            onClick={() => scrollToSection(id)}
            className="group relative flex items-center gap-2"
          >
            <span
              className={`pointer-events-none whitespace-nowrap text-[9px] uppercase tracking-[0.1em] text-muted-ink opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100`}
            >
              {t(`labels.${id}`)}
            </span>
            <span
              className={`text-[9px] tracking-[0.08em] transition-all duration-300 ${
                index === activeSlide
                  ? "text-foreground -translate-x-1"
                  : "text-muted-ink"
              }`}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          </button>
        ))}
      </nav>

      <div
        aria-hidden
        className="fixed inset-x-0 top-0 z-30 h-[2px] bg-line md:hidden"
      >
        <div
          className="h-full bg-rose transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </>
  );
}
