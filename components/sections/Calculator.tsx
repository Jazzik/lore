"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLeadSubmit } from "@/components/forms/useLeadSubmit";
import { DEMO_CONVERSION_RATE, estimate, type Model } from "@/lib/economics";

const MODELS: Model[] = ["percent", "preorder", "author"];

const AUDIENCE_MIN = 1_000;
const AUDIENCE_MAX = 1_000_000;
const ORDER_MIN = 500;
const ORDER_MAX = 15_000;
const ORDER_STEP = 100;

// Логарифмическая шкала: слайдер двигается 0..100, а аудитория растёт от
// 1 000 до 1 000 000 нелинейно, иначе весь полезный диапазон (5 000-200 000)
// умещается в первые несколько процентов хода ползунка.
function sliderToAudience(pos: number) {
  const minLog = Math.log10(AUDIENCE_MIN);
  const maxLog = Math.log10(AUDIENCE_MAX);
  return Math.round(10 ** (minLog + (pos / 100) * (maxLog - minLog)));
}

function audienceToSlider(audience: number) {
  const minLog = Math.log10(AUDIENCE_MIN);
  const maxLog = Math.log10(AUDIENCE_MAX);
  const clamped = Math.min(Math.max(audience, AUDIENCE_MIN), AUDIENCE_MAX);
  return ((Math.log10(clamped) - minLog) / (maxLog - minLog)) * 100;
}

// Компактные числа собираются вручную, а не через Intl с
// notation: "compact" — см. Cases.tsx. ICU в Node и в браузере расходятся на
// этом формате и React роняет гидрацию на несовпадении разметки.
function compact(value: number) {
  return value >= 1_000_000
    ? { scale: "millions" as const, value: value / 1_000_000 }
    : { scale: "thousands" as const, value: value / 1_000 };
}

export function Calculator() {
  const t = useTranslations("calculator");
  const format = useFormatter();

  const [audience, setAudience] = useState(50_000);
  const [averageOrder, setAverageOrder] = useState(3_000);
  const [model, setModel] = useState<Model>("percent");
  const [contact, setContact] = useState("");
  const [hp, setHp] = useState("");
  const { submit, status, fieldErrors, reset, errorCode } = useLeadSubmit();

  const result = useMemo(
    () =>
      estimate({
        audience,
        conversionRate: DEMO_CONVERSION_RATE,
        averageOrder,
        model,
      }),
    [audience, averageOrder, model],
  );

  function updateContact(value: string) {
    if (status === "success" || status === "error") reset();
    setContact(value);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const audienceLabel = format.number(audience);
    const orderLabel = format.number(averageOrder);
    const incomeLabel = format.number(result.authorIncome);
    submit(
      {
        name: "Без имени",
        contact,
        message: `Блок: calculator\nАудитория: ${audienceLabel}\nСредний чек: ${orderLabel} ₽\nМодель: ${model}\nОжидаемый доход: ${incomeLabel} ₽`,
        channel: "telegram",
        source: "calculator",
        hp,
      },
      { onSuccess: () => setContact("") },
    );
  }

  const audienceCompact = compact(audience);
  const revenueCompact = compact(result.revenue);
  const incomeCompact = compact(result.authorIncome);

  return (
    <section
      id="calculator"
      className="flex min-h-svh items-center px-6 py-24 md:px-[8vw]"
    >
      <div className="mx-auto w-full max-w-[1380px]">
        <Reveal className="mb-12 max-w-[640px]">
          <span className="text-[10px] uppercase tracking-[0.22em] text-muted-ink">
            {t("eyebrow")}
          </span>
          <h2 className="mt-4 font-serif text-[clamp(40px,6vw,90px)] leading-[0.9] tracking-[-0.045em] text-foreground">
            {t("title")}
            <em className="block italic text-rose">{t("titleAccent")}</em>
          </h2>
          <p className="mt-6 max-w-[480px] text-[15px] leading-relaxed text-foreground/80">
            {t("body")}
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-12 border-t border-line pt-10 md:grid-cols-[1fr_0.9fr]">
          <Reveal delay={0.1} className="space-y-10">
            <div>
              <div className="mb-3 flex items-baseline justify-between">
                <span className="text-[10px] uppercase tracking-[0.16em] text-muted-ink">
                  {t("controls.audience")}
                </span>
                <span className="font-serif text-2xl">
                  {t(`compact.${audienceCompact.scale}`, {
                    v: format.number(audienceCompact.value, { maximumFractionDigits: 1 }),
                  })}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={0.1}
                value={audienceToSlider(audience)}
                onChange={(e) => setAudience(sliderToAudience(Number(e.target.value)))}
                aria-label={t("controls.audience")}
                aria-valuetext={String(audience)}
                className="w-full accent-rose"
              />
            </div>

            <div>
              <div className="mb-3 flex items-baseline justify-between">
                <span className="text-[10px] uppercase tracking-[0.16em] text-muted-ink">
                  {t("controls.averageOrder")}
                </span>
                <span className="font-serif text-2xl">
                  {t("money.plain", { v: format.number(averageOrder) })}
                </span>
              </div>
              <input
                type="range"
                min={ORDER_MIN}
                max={ORDER_MAX}
                step={ORDER_STEP}
                value={averageOrder}
                onChange={(e) => setAverageOrder(Number(e.target.value))}
                aria-label={t("controls.averageOrder")}
                aria-valuetext={String(averageOrder)}
                className="w-full accent-rose"
              />
            </div>

            <div>
              <span className="mb-3 block text-[10px] uppercase tracking-[0.16em] text-muted-ink">
                {t("controls.model")}
              </span>
              <Tabs value={model} onValueChange={(v) => setModel(v as Model)}>
                <TabsList
                  variant="line"
                  className="h-auto justify-start gap-6 rounded-none border-b border-line bg-transparent p-0"
                >
                  {MODELS.map((key) => (
                    <TabsTrigger
                      key={key}
                      value={key}
                      className="rounded-none border-0 bg-transparent px-0 pb-3 text-[10px] uppercase tracking-[0.17em] text-muted-ink shadow-none data-active:bg-transparent data-active:text-foreground data-active:shadow-none after:bottom-0! after:bg-rose"
                    >
                      {t(`models.${key}`)}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="border border-line bg-paper p-8 md:p-10">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-6">
              <div>
                <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-ink">
                  {t("results.buyers")}
                </dt>
                <dd className="mt-1 font-serif text-2xl">{format.number(result.buyers)}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-ink">
                  {t("results.revenue")}
                </dt>
                <dd className="mt-1 font-serif text-2xl">
                  {t(`money.${revenueCompact.scale}`, {
                    v: format.number(revenueCompact.value, { maximumFractionDigits: 1 }),
                  })}
                </dd>
              </div>
              <div className="col-span-2 border-t border-line pt-6">
                <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-ink">
                  {t("results.authorIncome")}
                </dt>
                <dd className="mt-2 font-serif text-[clamp(40px,5vw,64px)] leading-none text-rose">
                  {t(`money.${incomeCompact.scale}`, {
                    v: format.number(incomeCompact.value, { maximumFractionDigits: 1 }),
                  })}
                </dd>
              </div>
            </dl>

            <p className="mt-6 text-xs leading-relaxed text-muted-ink">{t("disclaimer")}</p>

            <form onSubmit={handleSubmit} className="mt-8 border-t border-line pt-6">
              <input
                type="text"
                name="lore_hp_ref"
                value={hp}
                onChange={(e) => setHp(e.target.value)}
                tabIndex={-1}
                autoComplete="new-password"
                data-1p-ignore=""
                aria-hidden
                className="pointer-events-none absolute h-0 w-0 opacity-0"
              />
              <label className="block">
                <span className="mb-2 block text-[10px] uppercase tracking-[0.13em] text-muted-ink">
                  {t("form.contactLabel")}
                </span>
                <input
                  name="contact"
                  required
                  value={contact}
                  onChange={(e) => updateContact(e.target.value)}
                  aria-invalid={Boolean(fieldErrors.contact)}
                  aria-describedby={fieldErrors.contact ? "calculator-contact-error" : undefined}
                  className="w-full border-0 border-b border-line bg-transparent pb-3 text-[15px] outline-none focus:border-foreground"
                />
                {fieldErrors.contact ? (
                  <span id="calculator-contact-error" className="mt-2 block text-[11px] text-rose">
                    {t("form.errorContact")}
                  </span>
                ) : null}
              </label>
              <button
                type="submit"
                disabled={status === "pending"}
                className="mt-6 w-full border border-foreground bg-foreground px-8 py-4 text-[10px] uppercase tracking-[0.15em] text-background transition-colors hover:bg-transparent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                {status === "pending" ? t("form.submitting") : t("form.submit")}
              </button>
              {status === "success" ? (
                <p role="status" aria-live="polite" className="mt-4 text-sm text-foreground">
                  {t("form.success")}
                </p>
              ) : null}
              {status === "error" ? (
                <p role="alert" aria-live="assertive" className="mt-4 text-sm text-rose">
                  {errorCode === "rate_limited" ? t("form.errorRateLimited") : t("form.error")}
                </p>
              ) : null}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
