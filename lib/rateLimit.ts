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
