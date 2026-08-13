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
