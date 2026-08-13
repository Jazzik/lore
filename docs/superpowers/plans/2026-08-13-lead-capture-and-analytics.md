# P0 — Lead Capture & Analytics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Сделать так, чтобы заявка с лендинга физически доходила до команды LORE, чтобы с сайта можно было связаться без формы, и чтобы поведение посетителей измерялось.

**Architecture:** Одна серверная точка приёма — Route Handler `POST /api/lead`, который валидирует payload вручную (без новых зависимостей), режет спам honeypot-полем и in-memory rate-limit'ом, и отправляет сообщение в Telegram через Bot API. Клиент ходит в неё через уже подключённый, но пока неиспользуемый `@tanstack/react-query` (`QueryProvider` уже смонтирован в layout). Контакты живут в одном модуле `lib/contacts.ts` и переиспользуются футером, хедером и формой. Аналитика — Яндекс.Метрика через `next/script` плюс тонкая обёртка `lib/analytics.ts`, чтобы компоненты не знали про `window.ym`.

**Tech Stack:** Next.js 16 (App Router, Route Handlers), React 19, next-intl, @tanstack/react-query v5, Tailwind CSS v4. Тест-раннера в репозитории нет — см. Global Constraints.

**Spec:** конкурентный аудит от 2026-08-13 (в этой сессии). Отдельного spec-файла нет; требования зафиксированы в разделе Global Constraints и в тексте задач.

## Global Constraints

- **`node_modules` в этом worktree не установлен.** Первый шаг Task 1 — `pnpm install`. После этого, до написания кода Route Handler, обязательно прочитать `node_modules/next/dist/docs/` по Route Handlers и Metadata — этого требует `AGENTS.md`: в этой версии Next API могут отличаться от общеизвестных.
- **Никаких новых npm-зависимостей.** Валидация — руками (~40 строк), не zod. Это продолжение конвенции предыдущего плана репозитория.
- **Тест-раннера нет** (ни jest, ни vitest). Верификация каждой задачи — `pnpm exec tsc --noEmit` + `pnpm exec eslint --max-warnings=0 <изменённые файлы>`, плюс ручная проверка через dev-сервер там, где это указано явно. Не изобретать тестовый фреймворк в рамках этого плана.
- **`components/widgets/LiveCounter.tsx` не трогать.** Исключён заказчиком из скоупа.
- Вся копия — реальный финальный текст на RU и EN сразу. Никаких placeholder/TODO строк: обе локали публичные.
- После любой правки `messages/*.json` — `node .claude/skills/i18n-parity-check/check-parity.js`.
- Секреты только в env, никогда в коде и не в `NEXT_PUBLIC_*`, кроме id Метрики (он по своей природе публичный).
- Route Handler исключён из i18n-middleware уже сейчас: matcher в `middleware.ts` содержит `(?!api|...)`. Менять `middleware.ts` не нужно.

## Required input from stakeholder

Эти значения нельзя выдумать — без них Task 4 и Task 6 не завершаются. Запросить до старта:

| Что | Куда идёт |
|---|---|
| Telegram bot token и chat/group id для заявок | env `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` |
| Номер WhatsApp в международном формате | `lib/contacts.ts` |
| Публичный Telegram-хэндл (`@...`) | `lib/contacts.ts` |
| Email для входящих | `lib/contacts.ts` |
| Номер счётчика Яндекс.Метрики | env `NEXT_PUBLIC_YM_ID` |

Если чего-то нет на момент исполнения — задача останавливается и запрашивает значение, а не подставляет выдуманное.

---

## File Structure

Create:
- `lib/contacts.ts` — единственный источник правды по каналам связи: хэндлы + сборка ссылок `wa.me` / `t.me` / `mailto`.
- `lib/leadPayload.ts` — тип заявки и чистая функция валидации, общая для клиента и сервера.
- `lib/analytics.ts` — `track(event, params?)`, безопасная при отсутствующем `window.ym`.
- `app/api/lead/route.ts` — POST-обработчик: валидация, honeypot, rate-limit, отправка в Telegram.
- `lib/telegram.ts` — отправка сообщения в Bot API, отделена от HTTP-слоя, чтобы route оставался тонким.
- `lib/rateLimit.ts` — in-memory скользящее окно по IP.
- `components/forms/useLeadSubmit.ts` — react-query мутация + вызов `track`.
- `components/analytics/YandexMetrika.tsx` — инициализация счётчика.
- `.env.example` — документация переменных окружения.

Modify:
- `components/sections/Contact.tsx` — живая отправка, состояния, кликабельный футер.
- `components/widgets/FloatingCapture.tsx` — живая отправка вместо фиктивного `setSent(true)`.
- `components/layout/Header.tsx` — трекинг клика по CTA.
- `app/[locale]/layout.tsx` — монтирование счётчика.
- `messages/ru.json`, `messages/en.json` — строки состояний формы и подписи каналов.

---

### Task 1: Установка зависимостей и модуль контактов

**Files:**
- Create: `lib/contacts.ts`
- Modify: `.gitignore` (убедиться, что `.env*.local` игнорируется)
- Create: `.env.example`

**Interfaces:**
- Produces: `CONTACTS: { whatsappPhone: string; telegramHandle: string; email: string }`, `whatsappUrl(text?: string): string`, `telegramUrl(): string`, `mailtoUrl(subject?: string): string`.

- [ ] **Step 1: Установить зависимости**

```bash
pnpm install
```

Ожидается: `node_modules/` появился, `node_modules/next/dist/docs/` читается.

- [ ] **Step 2: Прочитать доки Next по Route Handlers**

```bash
ls node_modules/next/dist/docs/
```

Найти и прочитать страницы про Route Handlers (`app/api/*/route.ts`) и про Metadata. Этого требует `AGENTS.md` — в этой версии Next сигнатуры могли поменяться. Зафиксировать в комментарии к Task 4, если что-то отличается от привычного `export async function POST(request: Request)`.

- [ ] **Step 3: Создать `lib/contacts.ts`**

Реальные значения подставить из блока «Required input from stakeholder». Если их ещё нет — остановиться и запросить.

```ts
// Единственный источник правды по каналам связи. Любой компонент, которому
// нужна ссылка на WhatsApp/Telegram/почту, берёт её отсюда — чтобы смена
// номера была правкой одного файла, а не поиском по разметке.
export const CONTACTS = {
  // Международный формат без "+" и разделителей — так его требует wa.me.
  whatsappPhone: "79990000000",
  telegramHandle: "lorestudio",
  email: "hello@lore.studio",
} as const;

export function whatsappUrl(text?: string): string {
  const base = `https://wa.me/${CONTACTS.whatsappPhone}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function telegramUrl(): string {
  return `https://t.me/${CONTACTS.telegramHandle}`;
}

export function mailtoUrl(subject?: string): string {
  const base = `mailto:${CONTACTS.email}`;
  return subject ? `${base}?subject=${encodeURIComponent(subject)}` : base;
}
```

- [ ] **Step 4: Создать `.env.example`**

```bash
cat > .env.example <<'EOF'
# Бот, от имени которого приходят заявки. Создаётся через @BotFather.
TELEGRAM_BOT_TOKEN=
# Чат или группа, куда бот пишет. Для группы — отрицательное число.
TELEGRAM_CHAT_ID=
# Номер счётчика Яндекс.Метрики. Публичный по своей природе.
NEXT_PUBLIC_YM_ID=
EOF
```

- [ ] **Step 5: Проверить, что локальные env не попадут в git**

```bash
grep -n "env" .gitignore
```

Ожидается строка, покрывающая `.env*.local`. Если её нет — дописать `.env*.local`.

- [ ] **Step 6: Проверки**

```bash
pnpm exec tsc --noEmit && pnpm exec eslint --max-warnings=0 lib/contacts.ts
```

Ожидается: обе команды завершаются без ошибок.

- [ ] **Step 7: Коммит**

```bash
git add lib/contacts.ts .env.example .gitignore
git commit -m "feat: add single source of truth for contact channels"
```

---

### Task 2: Валидация заявки

**Files:**
- Create: `lib/leadPayload.ts`

**Interfaces:**
- Consumes: ничего.
- Produces: `type LeadChannel = "whatsapp" | "telegram" | "email"`, `type LeadPayload = { name: string; contact: string; message: string; channel: LeadChannel; source: string; hp: string }`, `type ValidationResult = { ok: true; value: LeadPayload } | { ok: false; errors: Partial<Record<keyof LeadPayload, string>> }`, `validateLead(input: unknown): ValidationResult`.

Одна и та же функция используется и в браузере (мгновенная подсветка полей), и в Route Handler (нельзя доверять клиенту).

- [ ] **Step 1: Создать `lib/leadPayload.ts`**

```ts
// Валидация заявки. Живёт отдельно от route и от компонентов, потому что
// нужна с обеих сторон: на клиенте для подсветки полей, на сервере — потому
// что клиенту нельзя верить. Руками, а не zod — в проекте держим ноль новых
// зависимостей.

export const LEAD_CHANNELS = ["whatsapp", "telegram", "email"] as const;
export type LeadChannel = (typeof LEAD_CHANNELS)[number];

export type LeadPayload = {
  name: string;
  contact: string;
  message: string;
  channel: LeadChannel;
  /** Какой блок страницы породил заявку: "contact" | "floating-capture". */
  source: string;
  /** Honeypot: настоящий человек его не видит и не заполняет. */
  hp: string;
};

export type ValidationResult =
  | { ok: true; value: LeadPayload }
  | { ok: false; errors: Partial<Record<keyof LeadPayload, string>> };

const MAX = { name: 100, contact: 200, message: 2000, source: 40 } as const;

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function validateLead(input: unknown): ValidationResult {
  const raw = (input ?? {}) as Record<string, unknown>;
  const errors: Partial<Record<keyof LeadPayload, string>> = {};

  const name = asString(raw.name);
  const contact = asString(raw.contact);
  const message = asString(raw.message);
  const source = asString(raw.source) || "unknown";
  const hp = asString(raw.hp);
  const channelRaw = asString(raw.channel);
  const channel = (LEAD_CHANNELS as readonly string[]).includes(channelRaw)
    ? (channelRaw as LeadChannel)
    : null;

  if (name.length < 2) errors.name = "too_short";
  else if (name.length > MAX.name) errors.name = "too_long";

  if (contact.length < 3) errors.contact = "too_short";
  else if (contact.length > MAX.contact) errors.contact = "too_long";
  else if (channel === "email" && !/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(contact))
    errors.contact = "not_an_email";

  if (message.length > MAX.message) errors.message = "too_long";
  if (source.length > MAX.source) errors.source = "too_long";
  if (!channel) errors.channel = "invalid";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    value: { name, contact, message, channel: channel as LeadChannel, source, hp },
  };
}

/** Honeypot заполнен — значит бот. Проверяется отдельно от validateLead,
 *  потому что боту надо отвечать успехом, а не ошибкой валидации. */
export function isBot(value: LeadPayload): boolean {
  return value.hp.length > 0;
}
```

- [ ] **Step 2: Проверить логику вручную**

```bash
pnpm exec tsx --eval "
import { validateLead, isBot } from './lib/leadPayload.ts';
console.log(validateLead({}));
console.log(validateLead({ name: 'Аня', contact: 'a@b.co', channel: 'email', source: 'contact', message: '', hp: '' }));
console.log(validateLead({ name: 'Аня', contact: 'не почта', channel: 'email', source: 'contact', message: '', hp: '' }));
" 2>/dev/null || node --experimental-strip-types -e "
const m = require('./lib/leadPayload.ts');
" 2>/dev/null || echo "SKIP: нет tsx — проверить логику через dev-сервер в Task 4"
```

Ожидается по порядку: `ok: false` с ошибками `name`/`contact`/`channel`; `ok: true`; `ok: false` с `contact: "not_an_email"`. Если раннер недоступен — не изобретать его, проверка переносится в ручной прогон Task 4 Step 6.

- [ ] **Step 3: Проверки**

```bash
pnpm exec tsc --noEmit && pnpm exec eslint --max-warnings=0 lib/leadPayload.ts
```

- [ ] **Step 4: Коммит**

```bash
git add lib/leadPayload.ts
git commit -m "feat: add shared lead payload validation"
```

---

### Task 3: Rate limit и отправка в Telegram

**Files:**
- Create: `lib/rateLimit.ts`
- Create: `lib/telegram.ts`

**Interfaces:**
- Consumes: `LeadPayload` из `lib/leadPayload.ts`.
- Produces: `checkRateLimit(key: string): boolean` (true = пропускаем), `sendLeadToTelegram(lead: LeadPayload): Promise<void>` (бросает `Error` при неуспехе).

- [ ] **Step 1: Создать `lib/rateLimit.ts`**

```ts
// Грубый in-memory лимит: один инстанс, одна память. Этого достаточно против
// случайного флуда с одного IP. От распределённого спама он не защищает —
// когда/если это станет проблемой, менять на Upstash/Redis, интерфейс тот же.

const WINDOW_MS = 60_000;
const MAX_IN_WINDOW = 5;

const hits = new Map<string, number[]>();

export function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_IN_WINDOW) {
    hits.set(key, recent);
    return false;
  }

  recent.push(now);
  hits.set(key, recent);

  // Карта не должна расти бесконечно на длинном процессе.
  if (hits.size > 5000) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }

  return true;
}
```

- [ ] **Step 2: Создать `lib/telegram.ts`**

```ts
import type { LeadPayload } from "@/lib/leadPayload";

const API = "https://api.telegram.org";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatLead(lead: LeadPayload): string {
  const lines = [
    "<b>Новая заявка с сайта</b>",
    `Имя: ${escapeHtml(lead.name)}`,
    `Канал: ${escapeHtml(lead.channel)}`,
    `Контакт: ${escapeHtml(lead.contact)}`,
    `Блок: ${escapeHtml(lead.source)}`,
  ];
  if (lead.message) lines.push("", escapeHtml(lead.message));
  return lines.join("\n");
}

export async function sendLeadToTelegram(lead: LeadPayload): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error("telegram_not_configured");
  }

  const res = await fetch(`${API}/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: formatLead(lead),
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });

  if (!res.ok) {
    // Тело Telegram'а полезно в логах, но наружу его отдавать нельзя.
    const body = await res.text().catch(() => "");
    throw new Error(`telegram_failed_${res.status}: ${body.slice(0, 300)}`);
  }
}
```

- [ ] **Step 3: Проверки**

```bash
pnpm exec tsc --noEmit && pnpm exec eslint --max-warnings=0 lib/rateLimit.ts lib/telegram.ts
```

- [ ] **Step 4: Коммит**

```bash
git add lib/rateLimit.ts lib/telegram.ts
git commit -m "feat: add rate limiting and telegram lead delivery"
```

---

### Task 4: Route Handler `POST /api/lead`

**Files:**
- Create: `app/api/lead/route.ts`

**Interfaces:**
- Consumes: `validateLead`, `isBot` из `lib/leadPayload.ts`; `checkRateLimit` из `lib/rateLimit.ts`; `sendLeadToTelegram` из `lib/telegram.ts`.
- Produces: HTTP-контракт — `200 {"ok":true}` при успехе и при боте; `400 {"ok":false,"errors":{...}}` при невалидном payload; `429 {"ok":false,"error":"rate_limited"}`; `500 {"ok":false,"error":"send_failed"}`.

- [ ] **Step 1: Свериться с доками Next**

Перечитать страницу про Route Handlers из `node_modules/next/dist/docs/` (найдена в Task 1 Step 2). Если сигнатура экспорта или способ чтения заголовков отличается от кода ниже — следовать докам, а не коду ниже, и отметить расхождение в комментарии.

- [ ] **Step 2: Создать `app/api/lead/route.ts`**

```ts
import { NextResponse } from "next/server";
import { validateLead, isBot } from "@/lib/leadPayload";
import { checkRateLimit } from "@/lib/rateLimit";
import { sendLeadToTelegram } from "@/lib/telegram";

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  const result = validateLead(body);

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, errors: result.errors },
      { status: 400 },
    );
  }

  // Боту отвечаем успехом: пусть считает, что сработало, и не подбирает обход.
  if (isBot(result.value)) {
    return NextResponse.json({ ok: true });
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
```

- [ ] **Step 3: Проверки типов и линта**

```bash
pnpm exec tsc --noEmit && pnpm exec eslint --max-warnings=0 app/api/lead/route.ts
```

- [ ] **Step 4: Завести локальный `.env.local`**

Взять реальные значения из блока «Required input from stakeholder».

```bash
cp .env.example .env.local
```

Заполнить `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID`. Если значений нет — остановиться и запросить их.

- [ ] **Step 5: Запустить dev-сервер**

Использовать preview-инструменты (`preview_start` с конфигом из `.claude/launch.json`), не `pnpm dev` через Bash.

- [ ] **Step 6: Ручная проверка всех четырёх веток контракта**

```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST localhost:3000/api/lead -H 'content-type: application/json' -d '{}'
```
Ожидается `400`.

```bash
curl -s -X POST localhost:3000/api/lead -H 'content-type: application/json' -d '{"name":"Тест","contact":"@test","channel":"telegram","message":"проверка","source":"contact","hp":""}'
```
Ожидается `{"ok":true}` **и реальное сообщение в Telegram-чате**. Проверить, что оно пришло.

```bash
curl -s -X POST localhost:3000/api/lead -H 'content-type: application/json' -d '{"name":"Бот","contact":"@bot","channel":"telegram","message":"","source":"contact","hp":"spam"}'
```
Ожидается `{"ok":true}` и **отсутствие** нового сообщения в Telegram.

```bash
for i in 1 2 3 4 5 6 7; do curl -s -o /dev/null -w "%{http_code} " -X POST localhost:3000/api/lead -H 'content-type: application/json' -d '{"name":"Тест","contact":"@test","channel":"telegram","message":"","source":"contact","hp":""}'; done; echo
```
Ожидается: первые коды `200`, последние — `429`.

- [ ] **Step 7: Коммит**

```bash
git add app/api/lead/route.ts
git commit -m "feat: add POST /api/lead route handler"
```

---

### Task 5: Клиентский хук отправки и строки состояний

**Files:**
- Create: `components/forms/useLeadSubmit.ts`
- Modify: `messages/ru.json`, `messages/en.json`

**Interfaces:**
- Consumes: `LeadPayload`, `LeadChannel` из `lib/leadPayload.ts`; `track` из `lib/analytics.ts` (Task 7 — до его появления импорт не добавлять, см. Step 1).
- Produces: `useLeadSubmit(): { submit: (payload: LeadPayload) => void; status: "idle" | "pending" | "success" | "error"; fieldErrors: Partial<Record<string, string>>; reset: () => void }`.

- [ ] **Step 1: Создать `components/forms/useLeadSubmit.ts`**

Аналитика подключается в Task 7 — здесь вызов `track` уже заложен, но импорт добавляется только после создания `lib/analytics.ts`. Порядок задач гарантирует, что Task 7 идёт следом; если исполняется вне порядка — сначала сделать Task 7 Step 1.

```ts
"use client";

import { useMutation } from "@tanstack/react-query";
import type { LeadPayload } from "@/lib/leadPayload";

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
  const mutation = useMutation({ mutationFn: postLead });

  const fieldErrors =
    (mutation.error as (Error & { fieldErrors?: Partial<Record<string, string>> }) | null)
      ?.fieldErrors ?? {};

  // react-query v5 отдаёт ровно эти четыре значения — пробрасываем как есть.
  return {
    submit: mutation.mutate,
    status: mutation.status,
    fieldErrors,
    reset: mutation.reset,
  } as const;
}
```

- [ ] **Step 2: Добавить строки состояний в `messages/ru.json`**

В namespace `contact` дописать после ключа `submit`:

```json
    "submitting": "Отправляем…",
    "success": "Заявка у нас. Ответим в течение рабочего дня.",
    "error": "Не отправилось. Напишите нам напрямую — контакты ниже.",
    "errors": {
      "name": "Как к вам обращаться?",
      "contact": "Оставьте контакт, по которому вас найти",
      "contactEmail": "Похоже, это не почта"
    },
```

В namespace `floatingCapture` дописать после `submit`:

```json
    "submitting": "…",
    "error": "Не отправилось — напишите нам в Telegram",
```

- [ ] **Step 3: Добавить те же ключи в `messages/en.json`**

В namespace `contact`:

```json
    "submitting": "Sending…",
    "success": "Got it. We'll reply within one business day.",
    "error": "Didn't go through. Reach us directly — contacts below.",
    "errors": {
      "name": "What should we call you?",
      "contact": "Leave a contact so we can reach you",
      "contactEmail": "That doesn't look like an email"
    },
```

В namespace `floatingCapture`:

```json
    "submitting": "…",
    "error": "Didn't send — message us on Telegram",
```

- [ ] **Step 4: Проверка паритета локалей**

```bash
node .claude/skills/i18n-parity-check/check-parity.js
```

Ожидается: расхождений нет.

- [ ] **Step 5: Проверки**

```bash
pnpm exec tsc --noEmit && pnpm exec eslint --max-warnings=0 components/forms/useLeadSubmit.ts
```

- [ ] **Step 6: Коммит**

```bash
git add components/forms/useLeadSubmit.ts messages/ru.json messages/en.json
git commit -m "feat: add lead submit hook and form state copy"
```

---

### Task 6: Оживить обе формы и футер

**Files:**
- Modify: `components/sections/Contact.tsx`
- Modify: `components/widgets/FloatingCapture.tsx`

**Interfaces:**
- Consumes: `useLeadSubmit` из `components/forms/useLeadSubmit.ts`; `CONTACTS`, `whatsappUrl`, `telegramUrl`, `mailtoUrl` из `lib/contacts.ts`.
- Produces: ничего для следующих задач.

- [ ] **Step 1: Переписать форму в `components/sections/Contact.tsx`**

Заменить блок `<TabsContent>` (сейчас строки ~59–105) на форму с контролируемым состоянием. Ключевое: `defaultValue` табов больше не только визуальный — активный таб становится полем `channel`, поэтому `Tabs` переезжает в контролируемое состояние.

```tsx
const [channel, setChannel] = useState<LeadChannel>("whatsapp");
const [values, setValues] = useState({ name: "", contact: "", message: "", hp: "" });
const { submit, status, fieldErrors } = useLeadSubmit();

function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  submit({ ...values, channel, source: "contact" });
}
```

`<Tabs value={channel} onValueChange={(v) => setChannel(v as LeadChannel)}>` вместо `defaultValue`, и **одна** форма под табами вместо трёх одинаковых копий в цикле по `METHODS` — сейчас цикл рендерит три идентичные формы, что и было причиной, по которой канал нигде не учитывался.

Каждый `<input>` получает `value` + `onChange`, `name`, `required` там, где поле обязательно, и `aria-invalid={Boolean(fieldErrors.name)}`.

Honeypot — поле, невидимое человеку, но присутствующее в DOM:

```tsx
<input
  type="text"
  name="company"
  value={values.hp}
  onChange={(e) => setValues((v) => ({ ...v, hp: e.target.value }))}
  tabIndex={-1}
  autoComplete="off"
  aria-hidden
  className="pointer-events-none absolute h-0 w-0 opacity-0"
/>
```

Кнопка: `disabled={status === "pending"}`, текст — `t("submitting")` при `pending`, иначе `t("submit")`.

Под кнопкой — сообщения:

```tsx
{status === "success" ? (
  <p className="text-sm text-foreground sm:col-span-2">{t("success")}</p>
) : null}
{status === "error" ? (
  <p className="text-sm text-rose sm:col-span-2">{t("error")}</p>
) : null}
```

Ошибки полей — под соответствующим инпутом, текст берётся из `t("errors.name")` / `t("errors.contact")`, а для `not_an_email` — `t("errors.contactEmail")`.

- [ ] **Step 2: Сделать футер кликабельным**

Заменить блок `<span>WhatsApp</span> <span>Telegram</span>` (строки ~118–120) на настоящие ссылки, добавив третьим каналом почту:

```tsx
<div className="flex flex-wrap gap-6 text-[11px] uppercase tracking-[0.1em] text-foreground/80">
  <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-rose">
    WhatsApp
  </a>
  <a href={telegramUrl()} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-rose">
    Telegram
  </a>
  <a href={mailtoUrl("Проект с LORE")} className="transition-colors hover:text-rose">
    {CONTACTS.email}
  </a>
</div>
```

- [ ] **Step 3: Оживить `components/widgets/FloatingCapture.tsx`**

Убрать локальный `const [sent, setSent] = useState(false)` и `setSent(true)` в `onSubmit` (строки 15 и 92) — это и был фальшивый успех. Вместо него:

```tsx
const [handle, setHandle] = useState("");
const [hp, setHp] = useState("");
const { submit, status } = useLeadSubmit();

function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  submit({
    name: "—",
    contact: handle,
    message: "",
    channel: "telegram",
    source: "floating-capture",
    hp,
  });
}
```

Рендер по статусу: `success` → `t("sent")` (ключ уже есть); `error` → `t("error")`; `pending` → кнопка `disabled`, текст `t("submitting")`. Honeypot — такой же скрытый инпут, как в Step 1.

Виджет отправляет только хэндл, поэтому `name` уходит как `"—"`: валидация требует минимум 2 символа, и это осознанная заглушка, а не пропуск поля.

- [ ] **Step 4: Проверки**

```bash
pnpm exec tsc --noEmit && pnpm exec eslint --max-warnings=0 components/sections/Contact.tsx components/widgets/FloatingCapture.tsx
```

- [ ] **Step 5: Ручная проверка в браузере**

На запущенном dev-сервере:
1. Отправить форму из секции «Контакты» — убедиться, что появилось сообщение об успехе и **сообщение пришло в Telegram** с правильным каналом и текстом `Блок: contact`.
2. Отправить пустую форму — убедиться, что подсвечены ошибки полей и запрос не ушёл дважды.
3. Переключить таб на Email, ввести не-почту — убедиться в сообщении `t("errors.contactEmail")`.
4. Отправить из плавающего виджета — убедиться в сообщении с `Блок: floating-capture`.
5. Кликнуть все три ссылки в футере — WhatsApp, Telegram, почта открываются.
6. Снять скриншот состояния успеха и приложить к отчёту о задаче.

- [ ] **Step 6: Коммит**

```bash
git add components/sections/Contact.tsx components/widgets/FloatingCapture.tsx
git commit -m "feat: wire contact form and floating capture to lead API"
```

---

### Task 7: Аналитика

**Files:**
- Create: `lib/analytics.ts`
- Create: `components/analytics/YandexMetrika.tsx`
- Modify: `app/[locale]/layout.tsx`
- Modify: `components/layout/Header.tsx`
- Modify: `components/forms/useLeadSubmit.ts`

**Interfaces:**
- Consumes: `NEXT_PUBLIC_YM_ID`.
- Produces: `track(event: string, params?: Record<string, unknown>): void`.

- [ ] **Step 1: Создать `lib/analytics.ts`**

```ts
// Тонкая обёртка над Метрикой. Компоненты вызывают track() и не знают ни про
// window.ym, ни про то, подключён ли счётчик вообще — на локалке и в превью
// его нет, и это не должно ронять страницу.

declare global {
  interface Window {
    ym?: (id: number, action: string, ...args: unknown[]) => void;
  }
}

export function track(event: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  const id = Number(process.env.NEXT_PUBLIC_YM_ID);
  if (!id || !window.ym) return;
  window.ym(id, "reachGoal", event, params);
}
```

- [ ] **Step 2: Создать `components/analytics/YandexMetrika.tsx`**

```tsx
"use client";

import Script from "next/script";

export function YandexMetrika() {
  const id = process.env.NEXT_PUBLIC_YM_ID;
  if (!id) return null;

  return (
    <Script id="ym-init" strategy="afterInteractive">
      {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
      k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
      (window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
      ym(${Number(id)}, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true });`}
    </Script>
  );
}
```

- [ ] **Step 3: Смонтировать счётчик в `app/[locale]/layout.tsx`**

Добавить импорт `import { YandexMetrika } from "@/components/analytics/YandexMetrika";` и вставить `<YandexMetrika />` последним элементом внутри `<body>`, после `</NextIntlClientProvider>`.

- [ ] **Step 4: Добавить события в `useLeadSubmit`**

В `useMutation` дописать колбэки:

```ts
const mutation = useMutation({
  mutationFn: postLead,
  onSuccess: (_data, variables) => {
    track("lead_submitted", { source: variables.source, channel: variables.channel });
  },
  onError: (_error, variables) => {
    track("lead_failed", { source: variables.source });
  },
});
```

и импорт `import { track } from "@/lib/analytics";`.

- [ ] **Step 5: Добавить событие на CTA в хедере**

В `components/layout/Header.tsx` (строки 20–26) обернуть обработчик:

```tsx
onClick={() => {
  track("cta_click", { placement: "header" });
  scrollToSection("contact");
}}
```

плюс импорт `track`.

- [ ] **Step 6: Проверки**

```bash
pnpm exec tsc --noEmit && pnpm exec eslint --max-warnings=0 lib/analytics.ts components/analytics/YandexMetrika.tsx app/\[locale\]/layout.tsx components/layout/Header.tsx components/forms/useLeadSubmit.ts
```

- [ ] **Step 7: Ручная проверка**

Заполнить `NEXT_PUBLIC_YM_ID` в `.env.local`, перезапустить dev-сервер. В браузере:
1. Проверить в network-запросах обращение к `mc.yandex.ru`.
2. Отправить форму, убедиться в консоли, что `window.ym` вызван (или проверить отчёт «Цели» в интерфейсе Метрики).
3. Убедиться, что без `NEXT_PUBLIC_YM_ID` страница по-прежнему рендерится без ошибок в консоли.

- [ ] **Step 8: Коммит**

```bash
git add lib/analytics.ts components/analytics/YandexMetrika.tsx app/\[locale\]/layout.tsx components/layout/Header.tsx components/forms/useLeadSubmit.ts
git commit -m "feat: add yandex metrika and lead funnel events"
```

---

### Task 8: Финальная приёмка P0

**Files:**
- Modify: ничего (только проверки и, при находках, точечные правки)

- [ ] **Step 1: Полная проверка проекта**

```bash
pnpm exec tsc --noEmit && pnpm exec eslint --max-warnings=0 . && node .claude/skills/i18n-parity-check/check-parity.js && pnpm build
```

Ожидается: всё зелёное, сборка проходит.

- [ ] **Step 2: Прогон обеих локалей в браузере**

Открыть `/ru` и `/en`. В каждой: отправить форму, проверить сообщение в Telegram, проверить ссылки футера. Убедиться, что строки состояний переведены, а не показывают ключи.

- [ ] **Step 3: Проверить, что секреты не в репозитории**

```bash
git log -p --all -- .env.local | head -5; grep -rn "TELEGRAM_BOT_TOKEN=" --include="*.ts" --include="*.tsx" . | grep -v node_modules
```

Ожидается: пусто в обоих случаях.

- [ ] **Step 4: Коммит, если были правки**

```bash
git add -A && git commit -m "chore: P0 acceptance fixes"
```
