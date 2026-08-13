"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";
import { SectionGlow } from "./decor";

const PIPELINE_ICONS = ["✦", "↗", "□", "↗", "◌", "□", "→"];

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
            className="border-b border-line py-10 md:border-b-0 md:border-r md:py-12 md:pr-[5vw]"
          >
            <div className="text-xs uppercase tracking-[0.08em]">
              {t("regular.kicker")}
            </div>
            <p className="mt-2 text-xs text-muted-ink">
              {t("regular.note")}
            </p>
            <ul className="mt-6 space-y-2 text-[13px] text-foreground/70">
              {does.map((item) => (
                <li key={item}>— {item}</li>
              ))}
            </ul>
            <p className="mt-8 text-xs text-muted-ink">
              {t("regular.restNote")}
            </p>
            <ul className="mt-4 space-y-2 text-[13px] text-foreground/70">
              {rest.map((item) => (
                <li key={item}>— {item}</li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.15} className="py-10 md:py-12 md:pl-[5vw]">
            <div className="text-xs uppercase tracking-[0.08em]">
              {t("us.kicker")}
            </div>
            <p className="mt-2 text-xs text-muted-ink">{t("us.note")}</p>
            <div className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {pipeline.map((step, i) => (
                <div
                  key={step}
                  className="text-center text-[11px] text-foreground/70"
                >
                  <div className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-full border border-line text-lg">
                    {PIPELINE_ICONS[i % PIPELINE_ICONS.length]}
                  </div>
                  {step}
                </div>
              ))}
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
