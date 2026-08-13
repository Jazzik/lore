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
