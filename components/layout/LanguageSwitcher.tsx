"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const other: Locale = locale === "ru" ? "en" : "ru";

  return (
    <button
      type="button"
      onClick={() => router.replace(pathname, { locale: other })}
      className="border-0 bg-transparent border-b border-line pb-[5px] text-[11px] uppercase tracking-[0.16em] text-foreground/80 transition-colors hover:text-rose"
      aria-label={`Switch language to ${other.toUpperCase()}`}
    >
      {other.toUpperCase()}
    </button>
  );
}
