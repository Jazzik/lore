// ДЕМО-ДАННЫЕ. Вымышлено для превью, не публиковать без замены на реальные.
// Цифры кейсов. Живут отдельно от messages/*.json намеренно: они одинаковы
// в обеих локалях, и им нельзя разъезжаться при переводе. Переводимый текст
// (имя, описание продукта) лежит в messages под тем же id.
//
// Значения — plain numbers, а не готовые строки: секция форматирует их под
// локаль (Intl.NumberFormat / next-intl useFormatter, включая ICU-плюрал для
// недель), поэтому английский посетитель не должен видеть русские "недель"
// или тонкий пробел в разрядах.
export type CaseStudy = {
  id: string;
  /** Размер аудитории на момент запуска. */
  audience: number;
  /** Продано единиц. */
  units: number;
  /** От брифа до первой отгрузки, в неделях. */
  leadTimeWeeks: number;
  /** Выручка проекта, в рублях. */
  revenue: number;
};

export const CASE_STUDIES: readonly CaseStudy[] = [
  {
    id: "vera-osenina",
    // Настольная игра, розница ≈ 2 800 ₽ — 1 400 × 2 800 = 3,92 млн ₽.
    audience: 310_000,
    units: 1_400,
    leadTimeWeeks: 7,
    revenue: 3_920_000,
  },
  {
    id: "dmitry-korshun",
    // Лимитированный парфюм, розница ≈ 6 500 ₽ — 2 100 × 6 500 = 13,65 млн ₽.
    audience: 540_000,
    units: 2_100,
    leadTimeWeeks: 9,
    revenue: 13_650_000,
  },
  {
    id: "milena-grace",
    // Соус, розница ≈ 650 ₽ — 900 × 650 = 585 тыс. ₽.
    audience: 180_000,
    units: 900,
    leadTimeWeeks: 5,
    revenue: 585_000,
  },
] as const;
