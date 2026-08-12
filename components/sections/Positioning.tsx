"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";
import { ProductScenePlaceholder } from "./decor";

export function Positioning() {
  const t = useTranslations("positioning");
  const titleLines = t.raw("titleLines") as string[];

  return (
    <section
      id="positioning"
      className="flex min-h-svh items-center px-6 py-24 md:px-[8vw]"
    >
      <div className="mx-auto grid w-full max-w-[1380px] items-center gap-12 md:grid-cols-2">
        <Reveal>
          <h2 className="font-serif text-[clamp(48px,6.7vw,110px)] leading-[0.85] tracking-[-0.04em]">
            {titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
            <em className="block italic text-rose">{t("titleAccent")}</em>
          </h2>
          <div className="mt-10 max-w-[470px]">
            <p className="text-[15px] leading-relaxed text-foreground/80">
              {t("body")}
            </p>
            <p className="mt-6 text-xs leading-relaxed text-muted-ink">
              {t("note")}
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <ProductScenePlaceholder />
        </Reveal>
      </div>
    </section>
  );
}
