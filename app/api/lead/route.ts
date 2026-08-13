// POST /api/lead — validates a lead submission, drops bots, throttles abuse,
// and forwards the lead to Telegram. Kept thin: validation, rate limiting and
// delivery all live in lib/*, this file only sequences them and shapes the
// HTTP response per the contract Task 5's forms are written against.
//
// Handler signature and request/response APIs follow
// node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md —
// `POST(request: Request)` using the native Web Request API, matching the
// brief's reference code with no divergence found.

import { NextResponse } from "next/server";
import { validateLead, isBot } from "@/lib/leadPayload";
import { checkRateLimit } from "@/lib/rateLimit";
import { sendLeadToTelegram } from "@/lib/telegram";

export async function POST(request: Request) {
  // No proxy header (self-hosted with nothing in front) means we can't tell
  // visitors apart — `ip === null` here deliberately skips rate limiting
  // rather than making the whole site share one 5-per-60s bucket. Losing
  // per-IP throttling in that case is far cheaper than dropping real leads
  // during a traffic spike; the honeypot below remains the bot defence.
  // Deploy behind a proxy that sets x-forwarded-for or x-real-ip to restore it.
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    null;

  const body: unknown = await request.json().catch(() => null);
  const result = validateLead(body);

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, errors: result.errors },
      { status: 400 },
    );
  }

  // lib/leadPayload.ts trims `hp` before validateLead hands back `value`, so
  // a bot that fills the honeypot with only whitespace would pass isBot()
  // (trimmed to ""). Check the raw pre-trim field too so whitespace-only
  // honeypot fills are still caught, without touching lib/leadPayload.ts or
  // the documented response contract.
  const rawHp =
    body !== null && typeof body === "object" && "hp" in body
      ? (body as Record<string, unknown>).hp
      : undefined;
  const bot = isBot(result.value) || (typeof rawHp === "string" && rawHp.length > 0);

  // Боту отвечаем успехом: пусть считает, что сработало, и не подбирает обход.
  if (bot) {
    return NextResponse.json({ ok: true });
  }

  // Rate limiting sits here — after validation/bot checks, right before the
  // expensive Telegram call — so failed validation never burns the budget
  // and a real user fixing a typo doesn't get locked out on their next try.
  if (ip !== null && !checkRateLimit(ip)) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429 },
    );
  }

  try {
    await sendLeadToTelegram(result.value);
  } catch (error) {
    // Заявка дороже тишины: логируем всё, наружу отдаём непрозрачный код.
    console.error("[lead] delivery failed", error);
    return NextResponse.json(
      { ok: false, error: "send_failed" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
