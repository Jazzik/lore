// Порядок обязан совпадать с массивом `showcase.items` в
// messages/{ru,en}.json. Своя съёмка ставится только там, где кадр чистый:
// плитка витрины показывает видео целиком, поэтому клипы с водяным знаком
// генератора сюда не годятся (они остались в hero, где знак скрыт
// градиентом). Остальные позиции пока хотлинк на higgsfield.ai — их
// закрывает LOR-47.
export const SHOWCASE_VIDEOS = [
  "https://static.higgsfield.ai/marketing/slides/hyper-mini.mp4",
  "https://static.higgsfield.ai/marketing/slides/tv-spot-mini.mp4",
  "https://static.higgsfield.ai/marketing/slides/product-review-mini.mp4",
  "https://static.higgsfield.ai/marketing/slides/ugc-virtual-try-on-mini.mp4",
  "https://static.higgsfield.ai/marketing/slides/pro-virtual-try-on-mini.mp4",
  "https://static.higgsfield.ai/marketing/slides/wild-card-mini.mp4",
  // «Набор для ухода» — свой клип с массажёром, без водяного знака.
  "/media/product-show-videos/facial-massager.mp4",
] as const;
