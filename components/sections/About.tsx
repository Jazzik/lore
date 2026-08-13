"use client";

// ДЕМО-ДАННЫЕ. Год основания, цифры о компании и состав команды в messages
// namespace `about` вымышлены для превью. Реквизиты юрлица намеренно НЕ
// выдуманы — выдуманные реквизиты опаснее их отсутствия.

import { useFormatter, useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";

export function About() {
  const t = useTranslations("about");
  const format = useFormatter();
  const stats = t.raw("stats") as { value: number; label: string }[];
  const roles = t.raw("team.roles") as string[];

  return (
    <section
      id="about"
      className="flex min-h-svh items-center px-6 py-24 md:px-[8vw]"
    >
      <div className="mx-auto w-full max-w-[1380px]">
        <Reveal className="mb-10 max-w-[640px]">
          <span className="text-[10px] uppercase tracking-[0.22em] text-muted-ink">
            {t("eyebrow")}
          </span>
          <h2 className="mt-4 font-serif text-[clamp(40px,6vw,90px)] leading-[0.9] tracking-[-0.045em] text-foreground">
            {t("titleLine")}
            <br />
            <em className="italic text-rose">{t("titleAccent")}</em>
          </h2>
        </Reveal>

        <Reveal
          delay={0.08}
          className="grid grid-cols-2 gap-8 border-l border-t border-line sm:grid-cols-4"
        >
          {stats.map((stat, i) => (
            <div key={i} className="border-b border-r border-line p-8">
              <div className="font-serif text-5xl leading-none text-foreground md:text-6xl">
                {format.number(stat.value)}
              </div>
              <div className="mt-3 text-xs leading-relaxed text-muted-ink">{stat.label}</div>
            </div>
          ))}
        </Reveal>

        <Reveal
          delay={0.15}
          className="mt-16 flex flex-col gap-6 border-t border-line pt-10 md:flex-row md:items-start md:justify-between"
        >
          <p className="max-w-[560px] text-[15px] leading-relaxed text-foreground/80">
            {t("team.body")}
          </p>
          <ul className="flex shrink-0 flex-col gap-2 text-xs uppercase tracking-[0.12em] text-muted-ink">
            {roles.map((role) => (
              <li key={role}>{role}</li>
            ))}
          </ul>
        </Reveal>

        <p className="mt-10 text-[11px] leading-relaxed text-muted-ink/70">{t("fineprint")}</p>
      </div>
    </section>
  );
}
