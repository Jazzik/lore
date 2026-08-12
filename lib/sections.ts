export const SLIDE_IDS = [
  "hero",
  "positioning",
  "differentiation",
  "services",
  "production",
  "product-discovery",
  "benefits",
  "showcase",
  "financial-model",
  "market-cases",
  "contact",
] as const;

export type SlideId = (typeof SLIDE_IDS)[number];
