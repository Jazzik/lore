// ДЕМО-ДАННЫЕ: конверсия и доли автора вымышлены, подтвердить перед публикацией.
//
// Расчёт дохода автора. Чистая функция без React: формулу правит заказчик,
// и её должно быть можно проверить прогоном, не поднимая браузер.

export type Model = "percent" | "preorder" | "author";

export type Estimate = {
  buyers: number;
  revenue: number;
  authorIncome: number;
};

/** Доля автора по каждой модели: растёт вместе с долей риска, который берёт
 *  на себя автор (см. financialModel.columns). В модели "author" автор сам
 *  финансирует производство и получает выручку, а LORE берёт фиксированный
 *  процент за производство/логистику/сервисы (см. financialModel.columns[2]
 *  в messages) — значит доля LORE здесь должна быть меньшинством, а не
 *  половиной, иначе автор, взявший на себя весь финансовый риск, получает
 *  тот же исход, что и при риске, разделённом с LORE. */
const AUTHOR_SHARE: Record<Model, number> = {
  percent: 0.15,
  preorder: 0.25,
  author: 0.8,
};

export function estimate(input: {
  audience: number;
  /** Доля аудитории, доходящая до покупки, как 0.01 = 1%. */
  conversionRate: number;
  averageOrder: number;
  model: Model;
}): Estimate {
  const audience = Math.max(0, Math.floor(input.audience));
  const rate = Math.min(Math.max(input.conversionRate, 0), 1);
  const average = Math.max(0, input.averageOrder);

  const buyers = Math.floor(audience * rate);
  const revenue = Math.round(buyers * average);
  const authorIncome = Math.round(revenue * AUTHOR_SHARE[input.model]);

  return { buyers, revenue, authorIncome };
}

/** Демо-параметр конверсии: НЕ пользовательский контрол — см. Step 5 брифа. */
export const DEMO_CONVERSION_RATE = 0.005;
