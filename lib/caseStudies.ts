// ДЕМО-ДАННЫЕ. Вымышлено для превью, не публиковать без замены на реальные.
// Цифры кейсов. Живут отдельно от messages/*.json намеренно: они одинаковы
// в обеих локалях, и им нельзя разъезжаться при переводе. Переводимый текст
// (имя, описание продукта) лежит в messages под тем же id.
export type CaseStudy = {
  id: string;
  /** Размер аудитории на момент запуска, как показываем: "480K". */
  audience: string;
  /** Продано единиц: "1 200". */
  units: string;
  /** От брифа до первой отгрузки: "6 недель". */
  leadTime: string;
  /** Выручка проекта: "4,1 млн ₽". */
  revenue: string;
};

export const CASE_STUDIES: readonly CaseStudy[] = [
  {
    id: "vera-osenina",
    audience: "310K",
    units: "1 400",
    leadTime: "7 недель",
    revenue: "4,2 млн ₽",
  },
  {
    id: "dmitry-korshun",
    audience: "540K",
    units: "2 100",
    leadTime: "9 недель",
    revenue: "6,3 млн ₽",
  },
  {
    id: "milena-grace",
    audience: "180K",
    units: "900",
    leadTime: "5 недель",
    revenue: "2,7 млн ₽",
  },
] as const;
