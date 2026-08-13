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
