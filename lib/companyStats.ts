// ДЕМО-ДАННЫЕ. Вымышлено для превью, не публиковать без замены на реальные.
// Цифры о компании. Живут отдельно от messages/*.json намеренно: они одинаковы
// в обеих локалях, и им нельзя разъезжаться при переводе. Переводимый текст
// (подпись под цифрой) лежит в messages под тем же id.
export type CompanyStat = {
  id: string;
  value: number;
};

export const COMPANY_STATS: CompanyStat[] = [
  { id: "projects", value: 42 },
  { id: "units", value: 61000 },
  { id: "factories", value: 6 },
  { id: "years", value: 7 },
];
