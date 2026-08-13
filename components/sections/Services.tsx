"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";

export function Services() {
  const t = useTranslations("services");
  const titleLines = t.raw("titleLines") as string[];
  const items = t.raw("items") as { title: string; lines: string[] }[];

  return (
    <section
      id="services"
      className="flex min-h-svh items-center px-6 py-24 md:px-[8vw]"
    >
      <div className="mx-auto grid w-full max-w-[1380px] gap-10 md:grid-cols-[34%_66%] md:gap-[6vw]">
        <Reveal>
          <h2 className="font-serif text-[clamp(56px,8vw,130px)] leading-[0.8] tracking-[-0.045em]">
            {titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
            <em className="italic text-rose">{t("titleAccent")}</em>
          </h2>
          <p className="mt-6 max-w-[380px] text-[15px] leading-relaxed text-foreground/80">
            {t("body")}
          </p>
        </Reveal>

        <Reveal
          delay={0.15}
          className="grid grid-cols-1 border-l border-t border-line sm:grid-cols-3"
        >
          {items.map((item, i) => (
            <article
              key={item.title}
              className={`group border-b border-r border-line p-7 transition-colors duration-300 hover:bg-rose/[0.04] ${
                i === 3 ? "sm:col-span-2" : ""
              }`}
            >
              <div className="font-serif text-xs text-rose">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-3 font-serif text-2xl">{item.title}</h3>
              <div className="mb-5 mt-3 h-px w-9 bg-muted-ink transition-all duration-300 group-hover:w-14 group-hover:bg-rose" />
              <p className="whitespace-pre-line text-xs leading-loose text-muted-ink">
                {item.lines.join("\n")}
              </p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
