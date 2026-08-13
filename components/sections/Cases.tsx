"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";
import { CASE_STUDIES } from "@/lib/caseStudies";

export function Cases() {
  const t = useTranslations("cases");
  const items = t.raw("items") as { id: string; name: string; text: string }[];

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
        <div className="grid grid-cols-1 border-y border-line sm:grid-cols-3">
          {items.map((item, i) => {
            const data = CASE_STUDIES.find((c) => c.id === item.id);
            if (!data) return null;

            return (
              <Reveal
                key={item.id}
                delay={i * 0.1}
                className={`border-b border-line px-6 py-10 sm:border-b-0 sm:px-[3.4vw] sm:py-12 ${
                  i > 0 ? "sm:border-l sm:border-line" : ""
                }`}
              >
                <h3 className="font-serif text-2xl leading-tight">
                  <em className="italic text-rose">{item.name}</em>
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-muted-ink">{item.text}</p>
                <dl className="mt-7 grid grid-cols-2 gap-x-4 gap-y-5">
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-ink">
                      {t("labels.audience")}
                    </dt>
                    <dd className="mt-1 font-serif text-lg">{data.audience}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-ink">
                      {t("labels.units")}
                    </dt>
                    <dd className="mt-1 font-serif text-lg">{data.units}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-ink">
                      {t("labels.leadTime")}
                    </dt>
                    <dd className="mt-1 font-serif text-lg">{data.leadTime}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-ink">
                      {t("labels.revenue")}
                    </dt>
                    <dd className="mt-1 font-serif text-lg">{data.revenue}</dd>
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
