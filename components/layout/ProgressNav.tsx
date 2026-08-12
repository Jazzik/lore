"use client";

import { useTranslations } from "next-intl";
import { useUIStore } from "@/store/ui";
import { SLIDE_IDS } from "@/lib/sections";
import { scrollToSection } from "@/lib/scrollToSection";

export function ProgressNav() {
  const t = useTranslations("progress");
  const activeSlide = useUIStore((state) => state.activeSlide);

  return (
    <nav
      aria-label={t("label")}
      className="fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-2 md:flex"
    >
      {SLIDE_IDS.map((id, index) => (
        <button
          key={id}
          type="button"
          onClick={() => scrollToSection(id)}
          className={`text-[9px] tracking-[0.08em] transition-all duration-300 ${
            index === activeSlide
              ? "text-foreground -translate-x-1"
              : "text-muted-ink"
          }`}
        >
          {String(index + 1).padStart(2, "0")}
        </button>
      ))}
    </nav>
  );
}
