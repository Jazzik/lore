"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";

export function FinancialModel() {
  const t = useTranslations("financialModel");
  const columns = t.raw("columns") as {
    num: string;
    title: string;
    body: string;
  }[];

  return (
    <section
      id="financial-model"
      className="flex min-h-svh items-center px-6 py-24 md:px-[8vw]"
    >
      <div className="mx-auto w-full max-w-[1380px]">
        <Reveal className="mb-12">
          <div className="font-serif text-[clamp(32px,5vw,60px)] italic leading-none text-muted-ink">
            {t("kicker")}
          </div>
          <h2 className="mt-4 font-serif text-[clamp(60px,9vw,145px)] leading-[0.75] tracking-[-0.045em]">
            {t("title")}
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 border-t border-line md:grid-cols-3">
          {columns.map((col, i) => (
            <Reveal
              key={col.num}
              delay={i * 0.1}
              className={`py-8 md:py-10 md:pr-[5vw] ${
                i > 0 ? "md:border-l md:border-line md:pl-[5vw]" : ""
              }`}
            >
              <div className="font-serif text-7xl leading-none">{col.num}</div>
              <h3 className="mt-6 text-base">{col.title}</h3>
              <p className="mt-4 max-w-[330px] text-[13px] leading-relaxed text-muted-ink">
                {col.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
