"use client";

import { useTranslations } from "next-intl";
import { scrollToSection } from "@/lib/scrollToSection";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const t = useTranslations("nav");

  return (
    <header className="fixed inset-x-0 top-0 z-30 flex h-[70px] items-center justify-between px-6 mix-blend-difference md:h-[82px] md:px-[5vw]">
      <button
        type="button"
        onClick={() => scrollToSection("hero")}
        className="font-serif text-2xl tracking-tight text-foreground"
      >
        LORE
      </button>
      <div className="flex items-center gap-8">
        <button
          type="button"
          onClick={() => scrollToSection("contact")}
          className="border-0 border-b border-line bg-transparent pb-[5px] text-[11px] uppercase tracking-[0.16em] text-foreground transition-colors hover:text-rose"
        >
          {t("cta")}
        </button>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
