// Выбор масштаба для крупных чисел вручную, без Intl notation: "compact".
//
// Причина — не стиль, а баг: ICU в Node и в браузере расходятся на компактной
// записи ("585,0 тыс. ₽" против "585 тыс. ₽"), и React роняет гидрацию на
// несовпадении разметки. Здесь масштаб выбираем сами, единицу берём из
// messages, а Intl оставляем только на десятичной части, где локали стабильны.
//
// Нижний порог в 100 000 существует потому, что без него маленькие суммы
// выглядели сломанными: доход в 375 ₽ печатался как «0,4 тыс. ₽» — и это в
// самом крупном шрифте секции калькулятора.
export type CompactScale = "plain" | "thousands" | "millions";

export function compactScale(value: number): { scale: CompactScale; value: number } {
  if (value >= 1_000_000) return { scale: "millions", value: value / 1_000_000 };
  if (value >= 100_000) return { scale: "thousands", value: value / 1_000 };
  return { scale: "plain", value };
}
