export const SLIDE_IDS = [
  "hero",
  "positioning",
  "showcase",
  "differentiation",
  "services",
  "production",
  "quality",
  "journey",
  "product-discovery",
  "benefits",
  "financial-model",
  "calculator",
  "market-cases",
  "cases",
  "faq",
  "contact",
] as const;

export type SlideId = (typeof SLIDE_IDS)[number];
