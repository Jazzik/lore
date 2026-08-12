"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";
import { VideoGrid } from "@/components/motion/VideoGrid";
import { SHOWCASE_VIDEOS } from "@/lib/showcaseVideos";

export function Showcase() {
  const t = useTranslations("showcase");
  const titleLines = t.raw("titleLines") as string[];
  const captions = t.raw("items") as string[];
  const items = SHOWCASE_VIDEOS.map((src, i) => ({
    src,
    caption: captions[i],
  }));

  return (
    <section
      id="showcase"
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
        <Reveal delay={0.15}>
          <VideoGrid items={items} />
        </Reveal>
      </div>
    </section>
  );
}
