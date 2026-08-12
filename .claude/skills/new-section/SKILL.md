---
name: new-section
description: Scaffold a new landing-page slide section component with matching RU/EN i18n keys, wired into the slide deck and page
metadata:
  disable-model-invocation: true
---

# New Section

Scaffolds a new full-viewport slide section for the LORE landing page, following the exact pattern already used by `components/sections/Benefits.tsx` and its siblings: a `Reveal`-wrapped `<section>` reading copy from `useTranslations(namespace)`, registered in the slide deck's id list, and inserted into `app/[locale]/page.tsx` in the right scroll order.

## Input

Ask the user (if not given in `$ARGUMENTS`) for:
1. **Section name** in PascalCase, e.g. `Testimonials` — becomes the component file and function name.
2. **Slide id** in kebab-case, e.g. `testimonials` — becomes the `id` attribute, the `SLIDE_IDS` entry, and the i18n namespace.
3. **Position** in the slide order — which existing section it goes before/after.

## Steps

1. **Read one existing section** (e.g. `components/sections/Benefits.tsx`) to match current conventions exactly — don't assume the pattern below is frozen, the codebase is the source of truth.

2. **Create `components/sections/<Name>.tsx`**:
   ```tsx
   "use client";

   import { useTranslations } from "next-intl";
   import { Reveal } from "@/components/motion/Reveal";

   export function <Name>() {
     const t = useTranslations("<slideId camelCase or as used elsewhere>");

     return (
       <section
         id="<slide-id>"
         className="flex min-h-svh items-center px-6 py-24 md:px-[8vw]"
       >
         <Reveal className="mx-auto w-full max-w-[1380px]">
           {/* content */}
         </Reveal>
       </section>
     );
   }
   ```
   Adjust the inner layout to whatever the section actually needs (grid, list, etc.) — copy the closest existing section's structure if the content shape is similar (e.g. a numbered grid like `Benefits.tsx`, or a two-column layout like `Positioning.tsx`).

3. **Add the slide id** to `lib/sections.ts`'s `SLIDE_IDS` array, in the correct position relative to the requested placement.

4. **Add the i18n namespace** to both `messages/ru.json` and `messages/en.json`, in the same key order as `SLIDE_IDS`. Write real copy in both languages — do not leave placeholder/TODO text, since this ships to both locales. Match the voice already established in neighboring sections (LORE = turnkey product studio for content creators/bloggers).

5. **Wire it into `app/[locale]/page.tsx`**: add the import and place the `<NewSection />` element in the correct position in the `<main>` list.

6. **Run the parity and type checks**:
   ```bash
   node .claude/skills/i18n-parity-check/check-parity.js
   pnpm exec tsc --noEmit
   pnpm exec eslint --max-warnings=0 components/sections/<Name>.tsx lib/sections.ts app/[locale]/page.tsx
   ```
   Fix anything they flag before considering the task done.

7. Report back the new section's id, its position in the deck, and confirm the checks passed.
