"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLeadSubmit } from "@/components/forms/useLeadSubmit";
import { CONTACTS, mailtoUrl, telegramUrl, whatsappUrl } from "@/lib/contacts";
import type { LeadChannel } from "@/lib/leadPayload";

const METHODS = ["whatsapp", "telegram", "email"] as const;

export function Contact() {
  const t = useTranslations("contact");
  const titleLines = t.raw("titleLines") as string[];

  const [channel, setChannel] = useState<LeadChannel>("whatsapp");
  const [values, setValues] = useState({ name: "", contact: "", message: "", hp: "" });
  const { submit, status, fieldErrors, reset, errorCode } = useLeadSubmit();

  // Once the user starts a new lead after a success/error, drop the stale
  // mutation state so the old success/error copy doesn't linger over fresh input.
  function updateValues(patch: Partial<typeof values>) {
    if (status === "success" || status === "error") reset();
    setValues((v) => ({ ...v, ...patch }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    submit(
      { ...values, channel, source: "contact" },
      {
        // Clear the form on success so a stray second tap on mobile (button
        // re-enables once status leaves "pending") can't resubmit the same
        // lead — the now-empty required fields block the browser from
        // submitting again.
        onSuccess: () => setValues({ name: "", contact: "", message: "", hp: "" }),
      },
    );
  }

  const whatsapp = whatsappUrl();
  const telegram = telegramUrl();
  const mailto = mailtoUrl("Проект с LORE");

  return (
    <section
      id="contact"
      className="flex min-h-svh items-center px-6 py-24 md:px-[8vw]"
    >
      <div className="mx-auto w-full max-w-[1050px]">
        <Reveal>
          <h2 className="font-serif text-[clamp(56px,11vw,165px)] leading-[0.72] tracking-[-0.05em]">
            {titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
            <em className="block italic text-rose">{t("titleAccent")}</em>
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 max-w-[520px]">
          <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-foreground/70">
            {t("eyebrow")}
          </span>
          <p className="text-sm leading-relaxed text-muted-ink">
            {t("formTitle")}
          </p>
        </Reveal>

        <Reveal delay={0.2} className="mt-10 border-t border-line pt-8">
          <Tabs value={channel} onValueChange={(v) => setChannel(v as LeadChannel)}>
            <TabsList
              variant="line"
              className="mb-8 h-auto justify-start gap-6 rounded-none border-b border-line bg-transparent p-0"
            >
              {METHODS.map((key) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="rounded-none border-0 bg-transparent px-0 pb-3 text-[10px] uppercase tracking-[0.17em] text-muted-ink shadow-none data-active:bg-transparent data-active:text-foreground data-active:shadow-none after:bottom-0! after:bg-rose"
                >
                  {t(`tabs.${key}`)}
                </TabsTrigger>
              ))}
            </TabsList>

          </Tabs>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2"
          >
            <input
              type="text"
              name="lore_hp_ref"
              value={values.hp}
              onChange={(e) => updateValues({ hp: e.target.value })}
              tabIndex={-1}
              autoComplete="new-password"
              data-1p-ignore=""
              aria-hidden
              className="pointer-events-none absolute h-0 w-0 opacity-0"
            />
            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.13em] text-muted-ink">
                {t("fields.name")}
              </span>
              <input
                name="name"
                required
                value={values.name}
                onChange={(e) => updateValues({ name: e.target.value })}
                aria-invalid={Boolean(fieldErrors.name)}
                aria-describedby={fieldErrors.name ? "contact-name-error" : undefined}
                className="w-full border-0 border-b border-line bg-transparent pb-3 text-[15px] outline-none focus:border-foreground"
              />
              {fieldErrors.name ? (
                <span id="contact-name-error" className="mt-2 block text-[11px] text-rose">
                  {t("errors.name")}
                </span>
              ) : null}
            </label>
            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.13em] text-muted-ink">
                {t("fields.contact")}
              </span>
              <input
                name="contact"
                required
                value={values.contact}
                onChange={(e) => updateValues({ contact: e.target.value })}
                aria-invalid={Boolean(fieldErrors.contact)}
                aria-describedby={fieldErrors.contact ? "contact-contact-error" : undefined}
                className="w-full border-0 border-b border-line bg-transparent pb-3 text-[15px] outline-none focus:border-foreground"
              />
              {fieldErrors.contact ? (
                <span id="contact-contact-error" className="mt-2 block text-[11px] text-rose">
                  {fieldErrors.contact === "not_an_email"
                    ? t("errors.contactEmail")
                    : t("errors.contact")}
                </span>
              ) : null}
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.13em] text-muted-ink">
                {t("fields.message")}
              </span>
              <input
                name="message"
                value={values.message}
                onChange={(e) => updateValues({ message: e.target.value })}
                maxLength={2000}
                aria-invalid={Boolean(fieldErrors.message)}
                aria-describedby={fieldErrors.message ? "contact-message-error" : undefined}
                className="w-full border-0 border-b border-line bg-transparent pb-3 text-[15px] outline-none focus:border-foreground"
              />
              {fieldErrors.message ? (
                <span id="contact-message-error" className="mt-2 block text-[11px] text-rose">
                  {t("errors.message")}
                </span>
              ) : null}
            </label>
            <button
              type="submit"
              disabled={status === "pending"}
              className="mt-2 w-fit border border-foreground bg-foreground px-8 py-4 text-[10px] uppercase tracking-[0.15em] text-background transition-colors hover:bg-transparent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-2"
            >
              {status === "pending" ? t("submitting") : t("submit")}
            </button>
            {status === "success" ? (
              <p role="status" aria-live="polite" className="text-sm text-foreground sm:col-span-2">
                {t("success")}
              </p>
            ) : null}
            {status === "error" ? (
              <p role="alert" aria-live="assertive" className="text-sm text-rose sm:col-span-2">
                {errorCode === "rate_limited" ? t("errorRateLimited") : t("error")}
              </p>
            ) : null}
          </form>

          <p className="mt-8 text-xs text-muted-ink">{t("note")}</p>
        </Reveal>

        <footer className="mt-20 flex flex-wrap items-center gap-6 border-t border-line pt-8">
          <span className="text-[9px] uppercase tracking-[0.15em] text-muted-ink">
            {t("footerLabel")}
          </span>
          <div className="flex flex-wrap gap-6 text-[11px] uppercase tracking-[0.1em] text-foreground/80">
            {whatsapp ? (
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-rose"
              >
                WhatsApp
              </a>
            ) : null}
            {telegram ? (
              <a
                href={telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-rose"
              >
                Telegram
              </a>
            ) : null}
            {mailto ? (
              <a href={mailto} className="transition-colors hover:text-rose">
                {CONTACTS.email}
              </a>
            ) : null}
          </div>
        </footer>
      </div>
    </section>
  );
}
