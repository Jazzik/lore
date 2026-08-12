export const SLIDE_IDS = [
  "hero",
  "positioning",
  "differentiation",
  "services",
  "product-discovery",
  "benefits",
  "financial-model",
  "market-cases",
  "contact",
] as const;

export type SlideId = (typeof SLIDE_IDS)[number];
