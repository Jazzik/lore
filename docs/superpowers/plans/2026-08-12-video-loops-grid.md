# Video Loops Grid Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring a higgsfield.ai-style grid of short, autoplaying, looping video tiles into the LORE landing page — enhancing `market-cases` with video and adding two new slide-deck sections (`production`, `showcase`).

**Architecture:** One reusable `VideoTile` (single lazy-mounted, autoplaying, muted `<video>` with an optional caption overlay) composed by a `VideoGrid` masonry-style wrapper (plain CSS grid, no new dependency). Two new full-viewport sections follow the existing slide-deck pattern (`SLIDE_IDS`, `Reveal`, `next-intl`) exactly, and `MarketCases` swaps its empty placeholder square for a bare `VideoTile`.

**Tech Stack:** Next.js 16 (App Router), React 19, next-intl, framer-motion, Tailwind CSS v4. No test runner is configured in this repo (no jest/vitest) — see Global Constraints.

## Global Constraints

- Spec: [docs/superpowers/specs/2026-08-12-video-loops-grid-design.md](../specs/2026-08-12-video-loops-grid-design.md).
- Video sources are **temporary hotlinks** to `https://static.higgsfield.ai/marketing/slides/*.mp4` — every URL lives in one small config file per section (`lib/showcaseVideos.ts`, `lib/productionVideos.ts`, `lib/marketCaseVideos.ts`) so swapping in real footage later is a one-file edit, no component changes.
- No new npm dependencies (masonry effect is hand-rolled CSS grid spans, not a library).
- Videos are muted only (`muted`), no sound, `playsInline`, `loop`, `autoPlay` — same pattern as the existing `HERO_VIDEO_SRC` usage in `components/sections/Hero.tsx`.
- No lightbox / click-to-expand — tiles are decorative, not an interactive gallery.
- All i18n copy is real, final RU/EN text written now — no placeholder/TODO strings, even though the video pixels themselves are temporary.
- New sections follow the existing slide-deck pattern exactly: full `min-h-svh` `<section id="...">`, added to `SLIDE_IDS` in `lib/sections.ts` (this alone wires up `ProgressNav` and scroll-spy — do not touch `ProgressNav.tsx`), and registered in `app/[locale]/page.tsx`.
- **No test runner exists in this repo.** Each task's verification step is `pnpm exec tsc --noEmit` + `pnpm exec eslint --max-warnings=0 <changed files>` instead of a red/green unit-test cycle. The final task performs the spec's manual dev-server verification.
- Run `node .claude/skills/i18n-parity-check/check-parity.js` after any `messages/*.json` edit.

---

## File Structure

Create:
- `lib/showcaseVideos.ts` — 7 temporary video URLs for the `showcase` section, in caption order.
- `lib/productionVideos.ts` — 5 temporary video URLs for the `production` section, in caption order.
- `lib/marketCaseVideos.ts` — case-name → video URL lookup for `MarketCases`.
- `lib/useInView.ts` — generic IntersectionObserver hook, mounts once and stays mounted.
- `components/motion/VideoTile.tsx` — one lazy-mounted autoplaying video cell, optional caption.
- `components/motion/VideoGrid.tsx` — masonry-style grid of `VideoTile`s.
- `components/sections/Production.tsx` — new slide section.
- `components/sections/Showcase.tsx` — new slide section.

Modify:
- `components/sections/MarketCases.tsx` — swap the empty placeholder square for `VideoTile`.
- `lib/sections.ts` — insert `production` after `services`, `showcase` after `benefits` in `SLIDE_IDS`.
- `messages/ru.json`, `messages/en.json` — add `production` and `showcase` namespaces.
- `app/[locale]/page.tsx` — import and place `<Production />`, `<Showcase />`.

---

### Task 1: Video source config files

**Files:**
- Create: `lib/showcaseVideos.ts`
- Create: `lib/productionVideos.ts`
- Create: `lib/marketCaseVideos.ts`

**Interfaces:**
- Produces: `SHOWCASE_VIDEOS: readonly string[]` (7 entries), `PRODUCTION_VIDEOS: readonly string[]` (5 entries), `MARKET_CASE_VIDEOS: Record<string, string>` (keys `"Rhode"`, `"Chamberlain Coffee"`, `"Skims"`).

- [ ] **Step 1: Create `lib/showcaseVideos.ts`**

```ts
// Temporary placeholder footage hotlinked from higgsfield.ai's public
// marketing assets. Swap these for real LORE product footage — the order
// must stay in sync with messages/{ru,en}.json's `showcase.items` array.
export const SHOWCASE_VIDEOS = [
  "https://static.higgsfield.ai/marketing/slides/hyper-mini.mp4",
  "https://static.higgsfield.ai/marketing/slides/tv-spot-mini.mp4",
  "https://static.higgsfield.ai/marketing/slides/product-review-mini.mp4",
  "https://static.higgsfield.ai/marketing/slides/ugc-virtual-try-on-mini.mp4",
  "https://static.higgsfield.ai/marketing/slides/pro-virtual-try-on-mini.mp4",
  "https://static.higgsfield.ai/marketing/slides/wild-card-mini.mp4",
  "https://static.higgsfield.ai/marketing/slides/tutorial-mini.mp4",
] as const;
```

- [ ] **Step 2: Create `lib/productionVideos.ts`**

```ts
// Temporary placeholder footage hotlinked from higgsfield.ai's public
// marketing assets. Swap these for real LORE production footage — the
// order must stay in sync with messages/{ru,en}.json's `production.items`.
export const PRODUCTION_VIDEOS = [
  "https://static.higgsfield.ai/marketing/slides/wild-card-mini.mp4",
  "https://static.higgsfield.ai/marketing/slides/hyper-mini.mp4",
  "https://static.higgsfield.ai/marketing/slides/unboxing-mini.mp4",
  "https://static.higgsfield.ai/marketing/slides/product-review-mini.mp4",
  "https://static.higgsfield.ai/marketing/slides/tv-spot-mini.mp4",
] as const;
```

- [ ] **Step 3: Create `lib/marketCaseVideos.ts`**

```ts
// Temporary placeholder footage hotlinked from higgsfield.ai's public
// marketing assets. Swap these for real case footage. Keyed by the case
// `name` field used in messages/{ru,en}.json's `marketCases.cases`.
export const MARKET_CASE_VIDEOS: Record<string, string> = {
  Rhode: "https://static.higgsfield.ai/marketing/slides/pro-virtual-try-on-mini.mp4",
  "Chamberlain Coffee":
    "https://static.higgsfield.ai/marketing/slides/product-review-mini.mp4",
  Skims: "https://static.higgsfield.ai/marketing/slides/ugc-virtual-try-on-mini.mp4",
};
```

- [ ] **Step 4: Type-check and lint**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

Run: `pnpm exec eslint --max-warnings=0 lib/showcaseVideos.ts lib/productionVideos.ts lib/marketCaseVideos.ts`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add lib/showcaseVideos.ts lib/productionVideos.ts lib/marketCaseVideos.ts
git commit -m "Add temporary video source config for showcase/production/market-cases"
```

---

### Task 2: `useInView` hook

**Files:**
- Create: `lib/useInView.ts`

**Interfaces:**
- Produces: `useInView<T extends HTMLElement>(rootMargin?: string): { ref: React.RefObject<T | null>; inView: boolean }`. `inView` flips to `true` once and never back to `false` (one-shot lazy mount, matches `Reveal`'s `once: true` viewport behavior already used across the app).
- Consumed by: `components/motion/VideoTile.tsx` (Task 3).

- [ ] **Step 1: Create `lib/useInView.ts`**

```ts
"use client";

import { useEffect, useRef, useState } from "react";

export function useInView<T extends HTMLElement>(rootMargin = "200px") {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, inView]);

  return { ref, inView };
}
```

- [ ] **Step 2: Type-check and lint**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

Run: `pnpm exec eslint --max-warnings=0 lib/useInView.ts`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/useInView.ts
git commit -m "Add useInView lazy-mount hook"
```

---

### Task 3: `VideoTile` component

**Files:**
- Create: `components/motion/VideoTile.tsx`

**Interfaces:**
- Consumes: `useInView<HTMLDivElement>()` from `lib/useInView.ts` (Task 2) — `{ ref, inView }`.
- Produces: `VideoTile({ src, caption, className }: { src: string; caption?: string; className?: string })` — a JSX element. Root element is a single `div` (no extra wrapper), so passing layout classes (`aspect-square`, `w-full`, grid span utilities, etc.) via `className` sizes the tile directly.
- Consumed by: `components/motion/VideoGrid.tsx` (Task 4), `components/sections/MarketCases.tsx` (Task 5).

- [ ] **Step 1: Create `components/motion/VideoTile.tsx`**

```tsx
"use client";

import { useInView } from "@/lib/useInView";

export function VideoTile({
  src,
  caption,
  className = "",
}: {
  src: string;
  caption?: string;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden bg-paper ${className}`}
    >
      {inView ? (
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
      {caption ? (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-8">
          <span className="text-[10px] uppercase tracking-[0.14em] text-foreground">
            {caption}
          </span>
        </div>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 2: Type-check and lint**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

Run: `pnpm exec eslint --max-warnings=0 components/motion/VideoTile.tsx`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/motion/VideoTile.tsx
git commit -m "Add VideoTile: lazy-mounted autoplaying video cell"
```

---

### Task 4: `VideoGrid` component

**Files:**
- Create: `components/motion/VideoGrid.tsx`

**Interfaces:**
- Consumes: `VideoTile` from `components/motion/VideoTile.tsx` (Task 3).
- Produces: `VideoGrid({ items }: { items: { src: string; caption: string }[] })` — a JSX element rendering a masonry-style grid.
- Consumed by: `components/sections/Production.tsx` (Task 6), `components/sections/Showcase.tsx` (Task 7).

- [ ] **Step 1: Create `components/motion/VideoGrid.tsx`**

```tsx
import { VideoTile } from "@/components/motion/VideoTile";

const SPAN_PATTERN = [
  "row-span-2",
  "row-span-1",
  "col-span-2 row-span-1",
  "row-span-1",
  "row-span-2",
  "row-span-1",
];

export function VideoGrid({
  items,
}: {
  items: { src: string; caption: string }[];
}) {
  return (
    <div className="grid grid-cols-2 auto-rows-[140px] grid-flow-dense gap-3 md:grid-cols-4 md:auto-rows-[160px]">
      {items.map((item, i) => (
        <VideoTile
          key={item.src + i}
          src={item.src}
          caption={item.caption}
          className={SPAN_PATTERN[i % SPAN_PATTERN.length]}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Type-check and lint**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

Run: `pnpm exec eslint --max-warnings=0 components/motion/VideoGrid.tsx`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/motion/VideoGrid.tsx
git commit -m "Add VideoGrid: masonry-style layout of VideoTiles"
```

---

### Task 5: Wire video into `MarketCases`

**Files:**
- Modify: `components/sections/MarketCases.tsx:31`

**Interfaces:**
- Consumes: `VideoTile` from `components/motion/VideoTile.tsx` (Task 3), `MARKET_CASE_VIDEOS` from `lib/marketCaseVideos.ts` (Task 1).

- [ ] **Step 1: Replace the placeholder square with `VideoTile`**

In `components/sections/MarketCases.tsx`, add the imports:

```tsx
import { VideoTile } from "@/components/motion/VideoTile";
import { MARKET_CASE_VIDEOS } from "@/lib/marketCaseVideos";
```

Replace:

```tsx
              {/* real product/case photography goes here — placeholder for now */}
              <div className="mx-auto mb-7 aspect-square w-full max-w-[240px] border border-line bg-paper" />
```

with:

```tsx
              <VideoTile
                src={MARKET_CASE_VIDEOS[item.name]}
                className="mx-auto mb-7 aspect-square w-full max-w-[240px] border border-line"
              />
```

- [ ] **Step 2: Type-check and lint**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

Run: `pnpm exec eslint --max-warnings=0 components/sections/MarketCases.tsx`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/sections/MarketCases.tsx
git commit -m "Play video in market-cases tiles instead of empty placeholder"
```

---

### Task 6: New section `production`

**Files:**
- Create: `components/sections/Production.tsx`
- Modify: `lib/sections.ts`
- Modify: `messages/ru.json`
- Modify: `messages/en.json`
- Modify: `app/[locale]/page.tsx`

**Interfaces:**
- Consumes: `Reveal` from `components/motion/Reveal.tsx`, `VideoGrid` from `components/motion/VideoGrid.tsx` (Task 4), `PRODUCTION_VIDEOS` from `lib/productionVideos.ts` (Task 1).
- Produces: `Production()` component, `id="production"`, i18n namespace `production` with keys `eyebrow`, `titleLines` (string[]), `titleAccent`, `body`, `items` (string[], length 5, same order as `PRODUCTION_VIDEOS`).

- [ ] **Step 1: Add `production` to `SLIDE_IDS`**

In `lib/sections.ts`, insert `"production"` right after `"services"`:

```ts
export const SLIDE_IDS = [
  "hero",
  "positioning",
  "differentiation",
  "services",
  "production",
  "product-discovery",
  "benefits",
  "financial-model",
  "market-cases",
  "contact",
] as const;
```

- [ ] **Step 2: Add the `production` namespace to `messages/ru.json`**

Insert after the `"services"` key (before `"productDiscovery"`):

```json
  "production": {
    "eyebrow": "Как это работает",
    "titleLines": ["от чертежа"],
    "titleAccent": "до коробки",
    "body": "Мы берём на себя весь путь продукта — от разработки до доставки к покупателю.",
    "items": ["Разработка", "Производство", "Упаковка", "Контроль качества", "Доставка"]
  },
```

- [ ] **Step 3: Add the `production` namespace to `messages/en.json`**

Insert after the `"services"` key (before `"productDiscovery"`):

```json
  "production": {
    "eyebrow": "How it works",
    "titleLines": ["from blueprint"],
    "titleAccent": "to doorstep",
    "body": "We handle the entire path of the product — from development to delivery.",
    "items": ["Development", "Manufacturing", "Packaging", "Quality control", "Delivery"]
  },
```

- [ ] **Step 4: Run the i18n parity check**

Run: `node .claude/skills/i18n-parity-check/check-parity.js`
Expected: `OK — <N> keys, ru.json and en.json are in parity.`

- [ ] **Step 5: Create `components/sections/Production.tsx`**

```tsx
"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";
import { VideoGrid } from "@/components/motion/VideoGrid";
import { PRODUCTION_VIDEOS } from "@/lib/productionVideos";

export function Production() {
  const t = useTranslations("production");
  const titleLines = t.raw("titleLines") as string[];
  const captions = t.raw("items") as string[];
  const items = PRODUCTION_VIDEOS.map((src, i) => ({
    src,
    caption: captions[i],
  }));

  return (
    <section
      id="production"
      className="flex min-h-svh items-center px-6 py-24 md:px-[8vw]"
    >
      <div className="mx-auto w-full max-w-[1380px]">
        <Reveal className="mb-10 max-w-[640px]">
          <span className="text-[10px] uppercase tracking-[0.22em] text-muted-ink">
            {t("eyebrow")}
          </span>
          <h2 className="mt-4 font-serif text-[clamp(40px,6vw,90px)] leading-[0.9] tracking-[-0.045em] text-foreground">
            {titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
            <em className="italic text-rose">{t("titleAccent")}</em>
          </h2>
          <p className="mt-6 max-w-[480px] text-[15px] leading-relaxed text-foreground/80">
            {t("body")}
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <VideoGrid items={items} />
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Wire `Production` into `app/[locale]/page.tsx`**

Add the import next to the other section imports:

```tsx
import { Production } from "@/components/sections/Production";
```

Place `<Production />` right after `<Services />` and before `<ProductDiscovery />`:

```tsx
        <Services />
        <Production />
        <ProductDiscovery />
```

- [ ] **Step 7: Type-check and lint**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

Run: `pnpm exec eslint --max-warnings=0 components/sections/Production.tsx lib/sections.ts "app/[locale]/page.tsx"`
Expected: no errors.

- [ ] **Step 8: Commit**

```bash
git add components/sections/Production.tsx lib/sections.ts messages/ru.json messages/en.json "app/[locale]/page.tsx"
git commit -m "Add production section: backstage video grid after services"
```

---

### Task 7: New section `showcase`

**Files:**
- Create: `components/sections/Showcase.tsx`
- Modify: `lib/sections.ts`
- Modify: `messages/ru.json`
- Modify: `messages/en.json`
- Modify: `app/[locale]/page.tsx`

**Interfaces:**
- Consumes: `Reveal` from `components/motion/Reveal.tsx`, `VideoGrid` from `components/motion/VideoGrid.tsx` (Task 4), `SHOWCASE_VIDEOS` from `lib/showcaseVideos.ts` (Task 1).
- Produces: `Showcase()` component, `id="showcase"`, i18n namespace `showcase` with keys `eyebrow`, `titleLines` (string[]), `titleAccent`, `body`, `items` (string[], length 7, same order as `SHOWCASE_VIDEOS`).

- [ ] **Step 1: Add `showcase` to `SLIDE_IDS`**

In `lib/sections.ts`, insert `"showcase"` right after `"benefits"`:

```ts
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
```

- [ ] **Step 2: Add the `showcase` namespace to `messages/ru.json`**

Insert after the `"benefits"` key (before `"financialModel"`):

```json
  "showcase": {
    "eyebrow": "Витрина продуктов",
    "titleLines": ["что можно"],
    "titleAccent": "сделать",
    "body": "От худи до термокружки — любой формат мерча, который логично продолжает бренд автора.",
    "items": ["Худи", "Кепка", "Термокружка", "Тоут-бэг", "Постер", "Пины", "Свеча"]
  },
```

- [ ] **Step 3: Add the `showcase` namespace to `messages/en.json`**

Insert after the `"benefits"` key (before `"financialModel"`):

```json
  "showcase": {
    "eyebrow": "Product showcase",
    "titleLines": ["what we"],
    "titleAccent": "can build",
    "body": "From hoodies to tumblers — any merch format that fits the creator's brand.",
    "items": ["Hoodie", "Cap", "Tumbler", "Tote bag", "Poster", "Pin set", "Candle"]
  },
```

- [ ] **Step 4: Run the i18n parity check**

Run: `node .claude/skills/i18n-parity-check/check-parity.js`
Expected: `OK — <N> keys, ru.json and en.json are in parity.`

- [ ] **Step 5: Create `components/sections/Showcase.tsx`**

```tsx
"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";
import { VideoGrid } from "@/components/motion/VideoGrid";
import { SHOWCASE_VIDEOS } from "@/lib/showcaseVideos";

export function Showcase() {
  const t = useTranslations("showcase");
  const titleLines = t.raw("titleLines") as string[];
  const captions = t.raw("items") as string[];
  const items = SHOWCASE_VIDEOS.map((src, i) => ({
    src,
    caption: captions[i],
  }));

  return (
    <section
      id="showcase"
      className="flex min-h-svh items-center px-6 py-24 md:px-[8vw]"
    >
      <div className="mx-auto w-full max-w-[1380px]">
        <Reveal className="mb-10 max-w-[640px]">
          <span className="text-[10px] uppercase tracking-[0.22em] text-muted-ink">
            {t("eyebrow")}
          </span>
          <h2 className="mt-4 font-serif text-[clamp(40px,6vw,90px)] leading-[0.9] tracking-[-0.045em] text-foreground">
            {titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
            <em className="italic text-rose">{t("titleAccent")}</em>
          </h2>
          <p className="mt-6 max-w-[480px] text-[15px] leading-relaxed text-foreground/80">
            {t("body")}
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <VideoGrid items={items} />
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Wire `Showcase` into `app/[locale]/page.tsx`**

Add the import next to the other section imports:

```tsx
import { Showcase } from "@/components/sections/Showcase";
```

Place `<Showcase />` right after `<Benefits />` and before `<FinancialModel />`:

```tsx
        <Benefits />
        <Showcase />
        <FinancialModel />
```

- [ ] **Step 7: Type-check and lint**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

Run: `pnpm exec eslint --max-warnings=0 components/sections/Showcase.tsx lib/sections.ts "app/[locale]/page.tsx"`
Expected: no errors.

- [ ] **Step 8: Commit**

```bash
git add components/sections/Showcase.tsx lib/sections.ts messages/ru.json messages/en.json "app/[locale]/page.tsx"
git commit -m "Add showcase section: product/merch video grid after benefits"
```

---

### Task 8: Full verification pass

**Files:** none (verification only).

- [ ] **Step 1: Run the full check suite**

```bash
node .claude/skills/i18n-parity-check/check-parity.js
pnpm exec tsc --noEmit
pnpm exec eslint --max-warnings=0
```

Expected: all three pass with no errors.

- [ ] **Step 2: Start the dev server and open the Browser pane**

Use the `preview_start` tool with `{"name": "dev"}` (check `.claude/launch.json`; if no entry exists yet, create one with `runtimeExecutable: "pnpm"`, `runtimeArgs: ["dev"]`, `port: 3000`). Navigate to `http://localhost:3000/ru`.

- [ ] **Step 3: Verify slide order and navigation**

Use `read_page` or `computer` screenshots to confirm the `ProgressNav` dots go: hero, positioning, differentiation, services, **production**, product-discovery, benefits, **showcase**, financial-model, market-cases, contact (11 dots total). Click through a few dots to confirm scroll-to-section still works.

- [ ] **Step 4: Verify video playback**

Scroll to the `production` section and take a screenshot — confirm the 5 tiles show moving video (not a static gradient) after they enter the viewport, each with its caption legible in the bottom-left scrim. Repeat for `showcase` (7 tiles) and `market-cases` (3 square tiles, no caption).

- [ ] **Step 5: Verify the English locale**

Navigate to `http://localhost:3000/en`. Confirm `production` shows "How it works" / "from blueprint to doorstep" and `showcase` shows "Product showcase" / "what we can build", with English captions (Development, Manufacturing, ... / Hoodie, Cap, ...).

- [ ] **Step 6: Verify mobile viewport**

Use `resize_window` with `preset: "mobile"`, reload, and screenshot the `showcase` grid — confirm it reflows to 2 columns with no horizontal overflow.

- [ ] **Step 7: Report results**

No commit for this task — it's verification only. If any step fails, fix the relevant earlier task's file and re-run the full suite before reporting done.
