"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";

export function Benefits() {
  const t = useTranslations("benefits");
  const items = t.raw("items") as { num: string; title: string; body: string }[];

  return (
    <section
      id="benefits"
      className="flex min-h-svh items-center px-6 py-24 md:px-[8vw]"
    >
      <div className="mx-auto grid w-full max-w-[1380px] grid-cols-1 border-l border-t border-line sm:grid-cols-2 md:grid-cols-3">
        {items.map((item, i) => (
          <Reveal
            key={item.num}
            delay={i * 0.06}
            className="border-b border-r border-line p-8"
          >
            <div className="font-serif text-6xl leading-none">{item.num}</div>
            <h3 className="mt-6 text-sm">{item.title}</h3>
            <p className="mt-3 max-w-[260px] text-xs leading-relaxed text-muted-ink">
              {item.body}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
