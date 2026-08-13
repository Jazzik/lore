"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Faq() {
  const t = useTranslations("faq");
  const items = t.raw("items") as { id: string; q: string; a: string }[];

  return (
    <section
      id="faq"
      className="flex min-h-svh items-center px-6 py-24 md:px-[8vw]"
    >
      <div className="mx-auto w-full max-w-[840px]">
        <Reveal className="mb-10">
          <span className="text-[10px] uppercase tracking-[0.22em] text-muted-ink">
            {t("eyebrow")}
          </span>
          <h2 className="mt-4 font-serif text-[clamp(32px,5vw,56px)] leading-[0.9] tracking-[-0.03em]">
            {t("title")} <em className="italic text-rose">{t("titleAccent")}</em>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <Accordion multiple className="border-b border-line">
            {items.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionPanel>{item.a}</AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
