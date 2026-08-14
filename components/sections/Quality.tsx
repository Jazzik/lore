"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";
import { scrollToSection } from "@/lib/scrollToSection";
import { track } from "@/lib/analytics";
import { QUALITY_IMAGES } from "@/lib/qualityImages";

export function Quality() {
  const t = useTranslations("quality");
  const titleLines = t.raw("titleLines") as string[];
  const materials = t.raw("materials.items") as { name: string; spec: string }[];
  const checks = t.raw("checks.items") as { num: string; title: string; body: string }[];

  return (
    <section
      id="quality"
      className="flex min-h-svh items-center px-6 py-24 md:px-[8vw]"
    >
      <div className="mx-auto w-full max-w-[1380px]">
        <Reveal className="mb-10 max-w-[640px]">
          <span className="text-[10px] uppercase tracking-[0.22em] text-muted-ink">
            {t("eyebrow")}
          </span>
          <h2 className="mt-4 font-serif text-[clamp(40px,6vw,90px)] leading-[0.9] tracking-[-0.045em] text-foreground">
            {titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
            <em className="italic text-rose">{t("titleAccent")}</em>
          </h2>
          <p className="mt-6 max-w-[480px] text-[15px] leading-relaxed text-foreground/80">
            {t("body")}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.1fr_0.9fr]">
          <Reveal delay={0.1}>
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
              <div>
                <h3 className="text-xs uppercase tracking-[0.16em] text-muted-ink">
                  {t("materials.title")}
                </h3>
                <ul className="mt-5 space-y-4">
                  {materials.map((item) => (
                    <li key={item.name} className="border-b border-line pb-4 text-[13px]">
                      <div className="text-foreground">{item.name}</div>
                      <div className="mt-1 text-muted-ink">{item.spec}</div>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-[0.16em] text-muted-ink">
                  {t("checks.title")}
                </h3>
                <ul className="mt-5 space-y-5">
                  {checks.map((item) => (
                    <li key={item.num}>
                      <div className="flex items-baseline gap-3">
                        <span className="font-serif text-2xl leading-none text-rose">
                          {item.num}
                        </span>
                        <span className="text-[13px] text-foreground">{item.title}</span>
                      </div>
                      <p className="mt-1.5 pl-9 text-xs leading-relaxed text-muted-ink">
                        {item.body}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="grid grid-cols-2 gap-3">
              {QUALITY_IMAGES.map((src) => (
                <div
                  key={src}
                  className="relative aspect-square overflow-hidden border border-line bg-paper"
                >
                  <Image
                    src={src}
                    alt={t("imageAlt")}
                    fill
                    sizes="(max-width: 768px) 45vw, 260px"
                    className="object-contain p-6"
                  />
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal
          delay={0.2}
          className="mt-16 flex flex-col gap-6 border-t border-line pt-10 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-[480px]">
            <h3 className="font-serif text-2xl leading-tight">
              <em className="italic text-rose">{t("sample.title")}</em>
            </h3>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-ink">
              {t("sample.body")}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              track("cta_click", { placement: "quality-sample" });
              scrollToSection("contact");
            }}
            className="shrink-0 self-start border-0 border-b border-line bg-transparent pb-[5px] text-[11px] uppercase tracking-[0.16em] text-foreground transition-colors hover:text-rose md:self-auto"
          >
            {t("sample.cta")}
          </button>
        </Reveal>
      </div>
    </section>
  );
}
