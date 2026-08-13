"use client";

import { useReducer, useState } from "react";
import type { FormEvent } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { QUIZ_STEPS } from "@/lib/quizSteps";
import { initialQuizState, quizReducer } from "./quizReducer";
import { useLeadSubmit } from "@/components/forms/useLeadSubmit";

export function Quiz() {
  const t = useTranslations("quiz");
  const [state, dispatch] = useReducer(quizReducer, initialQuizState);
  const [contact, setContact] = useState("");
  const [hp, setHp] = useState("");
  const { submit, status, fieldErrors, reset, errorCode } = useLeadSubmit();

  const step = QUIZ_STEPS[state.stepIndex];
  const answered = Object.keys(state.answers).length;

  function updateContact(value: string) {
    if (status === "success" || status === "error") reset();
    setContact(value);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // The team reads these leads in Telegram, so the brief is composed in
    // Russian regardless of the visitor's locale — same convention as the
    // calculator's lead message.
    const lines = QUIZ_STEPS.map((s) => {
      const value = state.answers[s.id];
      return `${t(`steps.${s.id}.short`)}: ${value ? t(`steps.${s.id}.options.${value}`) : "—"}`;
    });
    submit(
      {
        name: "Без имени",
        contact,
        message: `Блок: quiz\n${lines.join("\n")}`,
        channel: "telegram",
        source: "quiz",
        hp,
      },
      { onSuccess: () => setContact("") },
    );
  }

  return (
    <div className="border border-line bg-paper p-7 md:p-9">
      <div className="mb-6 flex items-baseline justify-between">
        <span className="text-[10px] uppercase tracking-[0.16em] text-muted-ink">
          {state.done
            ? t("resultKicker")
            : t("progress", { current: state.stepIndex + 1, total: QUIZ_STEPS.length })}
        </span>
        {state.stepIndex > 0 || state.done ? (
          <button
            type="button"
            onClick={() => dispatch({ type: "back" })}
            className="text-[10px] uppercase tracking-[0.14em] text-muted-ink transition-colors hover:text-foreground"
          >
            {t("back")}
          </button>
        ) : null}
      </div>

      <div
        aria-hidden
        className="mb-8 h-px w-full bg-line"
      >
        <div
          className="h-full bg-rose transition-[width] duration-300"
          style={{ width: `${(answered / QUIZ_STEPS.length) * 100}%` }}
        />
      </div>

      {/* Enter-only animation, deliberately not AnimatePresence with
          mode="wait": that variant holds the outgoing question in the DOM
          until its exit animation finishes, so any stalled frame loop shows
          an advanced "step N of 4" counter above the previous question.
          Keying a plain motion.div swaps the content synchronously and keeps
          the animation purely decorative. */}
      <div>
        {state.done ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="font-serif text-2xl leading-tight">{t("resultTitle")}</h3>
            <p className="mt-3 text-[13px] leading-relaxed text-muted-ink">
              {t("resultBody")}
            </p>

            <ul className="mt-6 space-y-2 border-t border-line pt-5 text-[12px] text-foreground/70">
              {QUIZ_STEPS.map((s) => (
                <li key={s.id} className="flex justify-between gap-4">
                  <span className="text-muted-ink">{t(`steps.${s.id}.short`)}</span>
                  <span className="text-right">
                    {t(`steps.${s.id}.options.${state.answers[s.id]}`)}
                  </span>
                </li>
              ))}
            </ul>

            {status === "success" ? (
              <p role="status" aria-live="polite" className="mt-6 text-sm text-foreground">
                {t("form.success")}
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-7 border-t border-line pt-6">
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
                    aria-describedby={fieldErrors.contact ? "quiz-contact-error" : undefined}
                    className="w-full border-0 border-b border-line bg-transparent pb-3 text-[15px] outline-none focus:border-foreground"
                  />
                  {fieldErrors.contact ? (
                    <span id="quiz-contact-error" className="mt-2 block text-[11px] text-rose">
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
                {status === "error" ? (
                  <p role="alert" aria-live="assertive" className="mt-4 text-sm text-rose">
                    {errorCode === "rate_limited" ? t("form.errorRateLimited") : t("form.error")}
                  </p>
                ) : null}
              </form>
            )}
          </motion.div>
        ) : (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <h3 className="font-serif text-2xl leading-tight">
              {t(`steps.${step.id}.question`)}
            </h3>
            <div role="group" aria-label={t(`steps.${step.id}.question`)} className="mt-6">
              {step.options.map((option) => {
                const selected = state.answers[step.id] === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => dispatch({ type: "answer", stepId: step.id, value: option })}
                    aria-pressed={selected}
                    className={`flex w-full items-center justify-between border-b border-line py-4 text-left text-[15px] transition-colors ${
                      selected ? "text-rose" : "text-foreground/85 hover:text-rose"
                    }`}
                  >
                    {t(`steps.${step.id}.options.${option}`)}
                    <span aria-hidden className="text-[11px] text-muted-ink">
                      →
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
