// Single source of truth for contact channels. Any component that needs
// a link to WhatsApp/Telegram/email should source it from here — so changing
// a contact number is a single file edit, not a hunt through markup.
export const CONTACTS = {
  whatsappPhone: process.env.NEXT_PUBLIC_CONTACT_WHATSAPP ?? "",
  telegramHandle: process.env.NEXT_PUBLIC_CONTACT_TELEGRAM ?? "",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
} as const;

export function whatsappUrl(text?: string): string | null {
  if (!CONTACTS.whatsappPhone) return null;
  const base = `https://wa.me/${CONTACTS.whatsappPhone}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function telegramUrl(): string | null {
  if (!CONTACTS.telegramHandle) return null;
  return `https://t.me/${CONTACTS.telegramHandle}`;
}

export function mailtoUrl(subject?: string): string | null {
  if (!CONTACTS.email) return null;
  const base = `mailto:${CONTACTS.email}`;
  return subject ? `${base}?subject=${encodeURIComponent(subject)}` : base;
}
