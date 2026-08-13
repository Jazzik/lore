"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";
import { SectionGlow } from "./decor";

export function Differentiation() {
  const t = useTranslations("differentiation");
  const does = t.raw("regular.does") as string[];
  const rest = t.raw("regular.rest") as string[];
  const pipeline = t.raw("us.pipeline") as string[];
  const statementLines = t.raw("us.statementLines") as string[];

  return (
    <section
      id="differentiation"
      className="relative flex min-h-svh items-center overflow-hidden px-6 py-24 md:px-[8vw]"
    >
      <SectionGlow className="-right-40 top-0" />
      <div className="mx-auto w-full max-w-[1380px]">
        <Reveal>
          <h2 className="font-serif text-[clamp(48px,7vw,105px)] leading-[0.85] tracking-[-0.045em]">
            {t("title")}
          </h2>
        </Reveal>

        <div className="mt-12 grid border-y border-line md:grid-cols-2">
          <Reveal
            delay={0.05}
            className="border-b border-line py-10 opacity-60 md:border-b-0 md:border-r md:py-12 md:pr-[5vw]"
          >
            <div className="text-xs uppercase tracking-[0.08em] text-muted-ink">
              {t("regular.kicker")}
            </div>
            <p className="mt-2 text-xs text-muted-ink">
              {t("regular.note")}
            </p>
            <ul className="mt-6 space-y-2 text-[13px] text-foreground/50">
              {does.map((item) => (
                <li key={item}>— {item}</li>
              ))}
            </ul>
            <p className="mt-8 text-xs text-muted-ink">
              {t("regular.restNote")}
            </p>
            <ul className="mt-4 space-y-2 text-[13px] text-foreground/50">
              {rest.map((item) => (
                <li key={item}>+ {item}</li>
              ))}
            </ul>
          </Reveal>

          <Reveal
            delay={0.15}
            className="relative py-10 md:py-12 md:pl-[5vw] md:before:absolute md:before:-left-px md:before:top-0 md:before:h-full md:before:w-px md:before:bg-rose/50"
          >
            <div className="text-xs uppercase tracking-[0.08em] text-rose">
              {t("us.kicker")}
            </div>
            <p className="mt-2 text-xs text-muted-ink">{t("us.note")}</p>
            <div className="relative mt-10">
              <div className="absolute left-0 right-0 top-[15px] hidden h-px bg-line sm:block" />
              <div className="grid grid-cols-2 gap-y-6 sm:grid-cols-4">
                {pipeline.map((step, i) => (
                  <div
                    key={step}
                    className="relative text-center text-[11px] text-foreground/70"
                  >
                    <div className="relative z-10 mx-auto mb-3 w-fit bg-background px-1 font-serif text-lg text-rose">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    {step}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-14 font-serif text-[clamp(28px,3.2vw,54px)] leading-[0.95]">
              {statementLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
              <em className="italic text-rose">{t("us.statementAccent")}</em>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
