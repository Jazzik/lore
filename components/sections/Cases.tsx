"use client";

import { useFormatter, useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";
import { CASE_STUDIES } from "@/lib/caseStudies";

export function Cases() {
  const t = useTranslations("cases");
  const format = useFormatter();
  const items = t.raw("items") as { id: string; num: string; name: string; text: string }[];

  return (
    <section
      id="cases"
      className="flex min-h-svh items-center px-6 py-24 md:px-[8vw]"
    >
      <div className="mx-auto w-full max-w-[1380px]">
        <Reveal className="mb-10">
          <span className="text-[10px] uppercase tracking-[0.22em] text-muted-ink">
            {t("eyebrow")}
          </span>
        </Reveal>
        <div className="grid grid-cols-1 border-l border-t border-line sm:grid-cols-3">
          {items.map((item, i) => {
            const data = CASE_STUDIES.find((c) => c.id === item.id);
            if (!data) return null;

            return (
              <Reveal
                key={item.id}
                delay={i * 0.06}
                className="border-b border-r border-line p-8"
              >
                <div className="font-serif text-6xl leading-none">{item.num}</div>
                <h3 className="mt-6 font-serif text-2xl leading-tight">
                  <em className="italic text-rose">{item.name}</em>
                </h3>
                <p className="mt-3 max-w-[300px] text-xs leading-relaxed text-muted-ink">
                  {item.text}
                </p>
                <dl className="mt-7 grid grid-cols-2 gap-x-4 gap-y-5">
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-ink">
                      {t("labels.audience")}
                    </dt>
                    <dd className="mt-1 font-serif text-lg">
                      {format.number(data.audience, { notation: "compact" })}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-ink">
                      {t("labels.units")}
                    </dt>
                    <dd className="mt-1 font-serif text-lg">{format.number(data.units)}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-ink">
                      {t("labels.leadTime")}
                    </dt>
                    <dd className="mt-1 font-serif text-lg">
                      {t("leadTimeWeeks", { n: data.leadTimeWeeks })}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-ink">
                      {t("labels.revenue")}
                    </dt>
                    <dd className="mt-1 font-serif text-lg">
                      {format.number(data.revenue, {
                        style: "currency",
                        currency: "RUB",
                        currencyDisplay: "narrowSymbol",
                        notation: "compact",
                        maximumFractionDigits: 1,
                      })}
                    </dd>
                  </div>
                </dl>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
