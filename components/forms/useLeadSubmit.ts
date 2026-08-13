"use client";

import { useMutation } from "@tanstack/react-query";
import type { LeadPayload } from "@/lib/leadPayload";
import { track } from "@/lib/analytics";

type ApiResponse = {
  ok: boolean;
  errors?: Partial<Record<string, string>>;
  error?: string;
};

async function postLead(payload: LeadPayload): Promise<ApiResponse> {
  const res = await fetch("/api/lead", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await res.json().catch(() => ({ ok: false }))) as ApiResponse;

  if (!res.ok || !data.ok) {
    const err = new Error(data.error ?? "request_failed") as Error & {
      fieldErrors?: Partial<Record<string, string>>;
    };
    err.fieldErrors = data.errors;
    throw err;
  }

  return data;
}

export function useLeadSubmit() {
  const mutation = useMutation({
    mutationFn: postLead,
    onSuccess: (_data, variables) => {
      track("lead_submitted", { source: variables.source, channel: variables.channel });
    },
    onError: (_error, variables) => {
      track("lead_failed", { source: variables.source });
    },
  });

  const fieldErrors =
    (mutation.error as (Error & { fieldErrors?: Partial<Record<string, string>> }) | null)
      ?.fieldErrors ?? {};

  // Additive discriminator so callers can tell rate_limited apart from
  // send_failed/network errors without changing the four existing fields
  // both forms already depend on. Mirrors the `error` string the route
  // returns ("rate_limited" | "send_failed"), or "request_failed" for
  // anything that never got a structured response (network error, bad JSON).
  const errorCode = mutation.isError
    ? (mutation.error as Error | null)?.message ?? "request_failed"
    : null;

  // react-query v5 отдаёт ровно эти четыре значения — пробрасываем как есть.
  return {
    submit: mutation.mutate,
    status: mutation.status,
    fieldErrors,
    reset: mutation.reset,
    errorCode,
  } as const;
}
