"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";

type Phase = {
  num: string;
  when: string;
  title: string;
  author: string;
  lore: string;
};

export function Launch() {
  const t = useTranslations("launch");
  const titleLines = t.raw("titleLines") as string[];
  const phases = t.raw("phases") as Phase[];

  return (
    <section
      id="launch"
      className="flex min-h-svh items-center px-6 py-24 md:px-[8vw]"
    >
      <div className="mx-auto w-full max-w-[1380px]">
        <Reveal className="mb-14 max-w-[640px]">
          <span className="text-[10px] uppercase tracking-[0.22em] text-muted-ink">
            {t("eyebrow")}
          </span>
          <h2 className="mt-4 font-serif text-[clamp(40px,6vw,90px)] leading-[0.9] tracking-[-0.045em]">
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

        <div className="relative">
          {/* The timeline rail only reads as a timeline once the phases sit in
              one row — on stacked layouts it would be a stray vertical line. */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-[11px] hidden h-px bg-line lg:block"
          />
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {phases.map((phase, i) => (
              <Reveal key={phase.num} delay={i * 0.07} className="relative">
                <div className="relative z-10 mb-5 w-fit bg-background pr-3 font-serif text-2xl leading-none text-rose">
                  {phase.num}
                </div>
                <div className="text-[10px] uppercase tracking-[0.16em] text-muted-ink">
                  {phase.when}
                </div>
                <h3 className="mt-2 font-serif text-2xl leading-tight">
                  {phase.title}
                </h3>
                <dl className="mt-6 space-y-4 border-t border-line pt-5">
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.14em] text-muted-ink">
                      {t("authorLabel")}
                    </dt>
                    <dd className="mt-1 text-[13px] leading-relaxed text-foreground/80">
                      {phase.author}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.14em] text-rose">
                      {t("loreLabel")}
                    </dt>
                    <dd className="mt-1 text-[13px] leading-relaxed text-foreground/80">
                      {phase.lore}
                    </dd>
                  </div>
                </dl>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal
          delay={0.1}
          className="mt-16 border-t border-line pt-10 font-serif text-[clamp(24px,3vw,44px)] leading-[1.05]"
        >
          <span className="block text-foreground/80">{t("statement")}</span>
          <em className="italic text-rose">{t("statementAccent")}</em>
        </Reveal>
      </div>
    </section>
  );
}
