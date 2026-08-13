// Грубый in-memory лимит: один инстанс, одна память. Этого достаточно против
// случайного флуда с одного IP. От распределённого спама он не защищает —
// когда/если это станет проблемой, менять на Upstash/Redis, интерфейс тот же.

const WINDOW_MS = 60_000;
const MAX_IN_WINDOW = 5;

// Hard cap on distinct tracked keys. Without this, a flood with rotating
// x-forwarded-for values (or just organic traffic at scale) grows the map
// without bound — and the old "sweep when size > 5000" approach only deleted
// keys whose *every* timestamp was stale, so a flood that keeps every key
// fresh made the sweep scan the whole map on every request and evict nothing.
const MAX_KEYS = 5000;

const hits = new Map<string, number[]>();

export function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_IN_WINDOW) {
    hits.set(key, recent);
    return false;
  }

  recent.push(now);

  // Delete-then-set moves this key to the end of the Map's iteration order
  // (Maps iterate in insertion order), so the map self-orders
  // least-recently-touched-first with no per-request scan.
  hits.delete(key);
  hits.set(key, recent);

  // Evict only the oldest entry/entries, O(evicted) instead of O(map size).
  while (hits.size > MAX_KEYS) {
    const oldestKey = hits.keys().next().value;
    if (oldestKey === undefined) break;
    hits.delete(oldestKey);
  }

  return true;
}
