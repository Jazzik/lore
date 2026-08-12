"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

// Demo-only value with a cosmetic tick — not wired to real production data.
const START = 7;
const TICK_MS = 14000;

export function LiveCounter() {
  const t = useTranslations("liveCounter");
  const [value, setValue] = useState(START);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setValue((v) => v + 1);
      setBump(true);
      const reset = setTimeout(() => setBump(false), 450);
      return () => clearTimeout(reset);
    }, TICK_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="fixed bottom-6 left-[22px] z-[42] hidden leading-none sm:block md:left-[2.2vw]"
      aria-hidden
    >
      <span className="mb-1.5 block text-[7px] uppercase tracking-[0.16em] text-muted-ink">
        {t("label")}
      </span>
      <span
        className="block font-serif text-[26px] tracking-[-0.04em] md:text-[31px]"
        style={bump ? { animation: "counterBump 0.45s ease" } : undefined}
      >
        {String(value).padStart(2, "0")}
      </span>
    </div>
  );
}
