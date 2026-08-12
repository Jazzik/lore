# Video loops grid — design

Date: 2026-08-12

## Goal

Bring higgsfield.ai's signature visual pattern — a dense grid of short, silently
autoplaying, looping video tiles — into the LORE landing page, adapted to LORE's
dark/editorial visual language (not higgsfield's neon SaaS style).

Reference: higgsfield.ai's "Viral Presets" and "Marketing Studio" grids — a
masonry wall of portrait video tiles, each with a caption in a bottom-left
gradient scrim, always autoplaying muted.

## Scope

Three touch points on the existing slide deck (`lib/sections.ts` → `SLIDE_IDS`):

1. **Enhance `market-cases`** (existing section) — its 3 case tiles
   (Rhode / Chamberlain Coffee / Skims) currently render an empty
   `bg-paper` square with a code comment saying real photography goes there
   ([MarketCases.tsx:31](../../../components/sections/MarketCases.tsx)). Swap
   the square for a looping video.
2. **New section `production`** — "how it works" backstage/process showcase
   (development → manufacturing → packaging → QC → delivery). Inserted
   **after `services`**, to visually back up the "we take production on
   ourselves" claim made right before it.
3. **New section `showcase`** — a masonry wall of merch-category examples
   (hoodie, cap, tumbler, tote, poster, pin set, candle). Inserted **after
   `benefits`**, as a visual bridge between "why this matters" and the
   concrete brand case studies in `market-cases`.

Resulting slide order:

```
hero → positioning → differentiation → services → production
     → product-discovery → benefits → showcase → market-cases → contact
```

## Video assets (temporary placeholders)

No real footage exists yet. Per explicit direction, we temporarily hotlink
real `.mp4` files already public on higgsfield's CDN
(`static.higgsfield.ai/marketing/slides/*.mp4`) as visual stand-ins, the same
way `Hero.tsx` already has a `HERO_VIDEO_SRC` placeholder pattern waiting for
real footage. **The captions/copy are real LORE content, written now — only
the pixels are a temporary stand-in**, and every URL lives in one small config
file per section so swapping in real footage later is a one-file edit, no
component changes.

Known risk: these are hotlinks to a third-party CDN not under our control —
they could disappear, get rate-limited, or be blocked from hotlinking at any
time. This is acceptable only as a temporary dev/staging state and must be
swapped for real, self-hosted (`public/media/`) footage before this ships to
production. This spec's implementation should make that swap trivial (single
array of URLs per section).

Source pool (8 usable clips found on higgsfield.ai/marketing-studio-intro):

| key | URL |
|---|---|
| hyper | `https://static.higgsfield.ai/marketing/slides/hyper-mini.mp4` |
| pro-try-on | `https://static.higgsfield.ai/marketing/slides/pro-virtual-try-on-mini.mp4` |
| product-review | `https://static.higgsfield.ai/marketing/slides/product-review-mini.mp4` |
| tutorial | `https://static.higgsfield.ai/marketing/slides/tutorial-mini.mp4` |
| tv-spot | `https://static.higgsfield.ai/marketing/slides/tv-spot-mini.mp4` |
| ugc-try-on | `https://static.higgsfield.ai/marketing/slides/ugc-virtual-try-on-mini.mp4` |
| unboxing | `https://static.higgsfield.ai/marketing/slides/unboxing-mini.mp4` |
| wild-card | `https://static.higgsfield.ai/marketing/slides/wild-card-mini.mp4` |

Assignment (clips are reused across sections since the sections are never
visible at the same time — acceptable for temporary placeholders):

**`market-cases`** (3 tiles, square, replacing the existing placeholder div):

| case | clip |
|---|---|
| Rhode | pro-try-on |
| Chamberlain Coffee | product-review |
| Skims | ugc-try-on |

**`showcase`** (7 tiles, masonry):

| caption (RU) | caption (EN) | clip |
|---|---|---|
| Худи | Hoodie | hyper |
| Кепка | Cap | tv-spot |
| Термокружка | Tumbler | product-review |
| Тоут-бэг | Tote bag | ugc-try-on |
| Постер | Poster | pro-try-on |
| Пины | Pin set | wild-card |
| Свеча | Candle | tutorial |

**`production`** (5 tiles, masonry):

| caption (RU) | caption (EN) | clip |
|---|---|---|
| Разработка | Development | wild-card |
| Производство | Manufacturing | hyper |
| Упаковка | Packaging | unboxing |
| Контроль качества | Quality control | product-review |
| Доставка | Delivery | tv-spot |

## Component design

**`components/motion/VideoTile.tsx`** — one grid cell.

- Props: `src: string`, `caption: string`, `className?: string` (for
  grid span utilities).
- Renders a `div` with a dark gradient placeholder background. An
  IntersectionObserver-backed hook (`useInView`-style, `rootMargin: "200px"`)
  mounts the `<video>` tag only once the tile nears the viewport — with up to
  9 tiles per slide we don't want them all fetching at once.
- `<video autoPlay loop muted playsInline preload="none" className="h-full w-full object-cover">` —
  same always-on autoplay pattern already used in `Hero.tsx`, no hover
  requirement.
- Caption renders bottom-left over a `bg-gradient-to-t from-black/70`
  scrim, `text-[10px] uppercase tracking-[0.14em]` — matching the eyebrow
  typography already used across sections, not a copy of higgsfield's bold
  neon caption style.

**`components/motion/VideoGrid.tsx`** — masonry-style layout wrapper.

- Props: `items: { src: string; caption: string }[]`.
- Plain CSS grid (`grid grid-cols-2 md:grid-cols-4 auto-rows-[140px] md:auto-rows-[160px] grid-flow-dense gap-3`),
  each `VideoTile` gets a fixed `row-span`/`col-span` pattern cycling through
  2–3 preset shapes (tall portrait, short portrait, wide) so the wall reads as
  masonry without a masonry library — no new dependency.
- Used by both `showcase` and `production`; `market-cases` keeps its own
  existing 3-column layout and uses `VideoTile` directly (not `VideoGrid`).

**Config files** (mirroring `lib/rotatingCaptureImages.ts`):

- `lib/showcaseVideos.ts` — exports `SHOWCASE_VIDEOS: { key: string; src: string }[]`
  (7 entries, keys matching i18n caption keys).
- `lib/productionVideos.ts` — same shape, 5 entries.
- `lib/marketCaseVideos.ts` — exports `MARKET_CASE_VIDEOS: Record<string, string>`
  keyed by case name (`Rhode`, `Chamberlain Coffee`, `Skims`).

Captions themselves live in `messages/{ru,en}.json` (real, translated copy,
not in the video config), read via `useTranslations` same as every other
section.

## New sections

Both follow the `new-section` skill scaffold exactly (full `min-h-svh` slide,
`Reveal`-wrapped, id added to `SLIDE_IDS`, i18n namespace in both locale
files, registered in `app/[locale]/page.tsx`). Copy:

**`production`**
- RU: eyebrow "Как это работает", title "от чертежа" / accent "до коробки",
  body "Мы берём на себя весь путь продукта — от разработки до доставки к покупателю."
- EN: eyebrow "How it works", title "from blueprint" / accent "to doorstep",
  body "We handle the entire path of the product — from development to delivery."

**`showcase`**
- RU: eyebrow "Витрина продуктов", title "что можно" / accent "сделать",
  body "От худи до термокружки — любой формат мерча, который логично продолжает бренд автора."
- EN: eyebrow "Product showcase", title "what we" / accent "can build",
  body "From hoodies to tumblers — any merch format that fits the creator's brand."

## Files to create / modify

Create:
- `components/motion/VideoTile.tsx`
- `components/motion/VideoGrid.tsx`
- `lib/showcaseVideos.ts`
- `lib/productionVideos.ts`
- `lib/marketCaseVideos.ts`
- `components/sections/Production.tsx`
- `components/sections/Showcase.tsx`

Modify:
- `components/sections/MarketCases.tsx` — swap placeholder square for `VideoTile`
- `lib/sections.ts` — add `production`, `showcase` to `SLIDE_IDS`
- `messages/ru.json`, `messages/en.json` — add `production`, `showcase`
  namespaces; add caption keys to `marketCases`
- `app/[locale]/page.tsx` — import + place `<Production />`, `<Showcase />`

No changes needed to `ProgressNav.tsx` or scroll-spy — both derive from
`SLIDE_IDS` automatically.

## Non-goals

- No real footage sourcing/licensing — out of scope, follow-up work once
  LORE has actual product/production footage.
- No masonry npm dependency — hand-rolled grid spans are sufficient for a
  fixed, known tile count per section.
- No lightbox/click-to-expand on tiles — tiles are decorative/atmospheric,
  not interactive galleries.
- No video sound — muted only, consistent with `Hero.tsx`.

## Verification

1. `node .claude/skills/i18n-parity-check/check-parity.js` — key parity
   between `ru.json`/`en.json`.
2. `pnpm exec tsc --noEmit`
3. `pnpm exec eslint --max-warnings=0` on all new/changed files.
4. Dev server visual check in both `/ru` and `/en`:
   - `production` and `showcase` slides appear in the right scroll order,
     with working `ProgressNav` dots.
   - Videos lazy-mount near viewport and autoplay muted/looped.
   - `market-cases` tiles play video instead of the empty square.
   - Mobile viewport (375px) — grid reflows to 2 columns, no overflow.
