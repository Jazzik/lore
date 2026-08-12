"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";
import { CharacterPlaceholder } from "./decor";

export function ProductDiscovery() {
  const t = useTranslations("productDiscovery");
  const titleLines = t.raw("titleLines") as string[];
  const steps = t.raw("analysisSteps") as string[];
  const bottomLines = t.raw("bottomLines") as string[];

  return (
    <section
      id="product-discovery"
      className="flex min-h-svh items-center px-6 py-24 md:px-[8vw]"
    >
      <div className="mx-auto grid w-full max-w-[1380px] items-center gap-12 md:grid-cols-2">
        <Reveal>
          <h2 className="font-serif text-[clamp(40px,8.2vw,135px)] leading-[0.8] tracking-[-0.045em]">
            {titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
            <em className="block italic text-rose">{t("titleAccent")}</em>
          </h2>
          <p className="mt-8 max-w-[520px] text-base leading-relaxed text-foreground/80">
            {t("quote")}
          </p>
          <p className="mt-6 max-w-[520px] text-[15px] leading-loose text-foreground/60">
            {steps.map((step, i) => (
              <span key={step}>
                {step}
                {i < steps.length - 1 ? (
                  <span className="text-rose"> → </span>
                ) : null}
              </span>
            ))}
          </p>
          <div className="mt-10 font-serif text-[clamp(26px,4vw,50px)] leading-[0.95]">
            {bottomLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
            <em className="italic text-rose">{t("bottomAccent")}</em>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <CharacterPlaceholder />
        </Reveal>
      </div>
    </section>
  );
}
