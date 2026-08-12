"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";
import { VideoTile } from "@/components/motion/VideoTile";
import { MARKET_CASE_VIDEOS } from "@/lib/marketCaseVideos";

export function MarketCases() {
  const t = useTranslations("marketCases");
  const cases = t.raw("cases") as { name: string; text: string }[];

  return (
    <section
      id="market-cases"
      className="flex min-h-svh items-center px-6 py-24 md:px-[8vw]"
    >
      <div className="mx-auto w-full max-w-[1380px]">
        <Reveal className="mb-10">
          <span className="text-[10px] uppercase tracking-[0.22em] text-muted-ink">
            {t("eyebrow")}
          </span>
        </Reveal>
        <div className="grid grid-cols-1 border-y border-line sm:grid-cols-3">
          {cases.map((item, i) => (
            <Reveal
              key={item.name}
              delay={i * 0.1}
              className={`border-b border-line px-6 py-10 text-center sm:border-b-0 sm:px-[4.2vw] sm:py-12 ${
                i > 0 ? "sm:border-l sm:border-line" : ""
              }`}
            >
              <VideoTile
                src={MARKET_CASE_VIDEOS[item.name]}
                className="mx-auto mb-7 aspect-square w-full max-w-[240px] border border-line"
              />
              <p className="mx-auto max-w-[390px] font-serif text-lg leading-tight">
                <span className="text-rose">{item.name}</span> — {item.text}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
