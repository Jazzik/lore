# P2 — Growth, SEO & Legal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Сделать так, чтобы на лендинг приходили из поиска и мессенджеров, чтобы посетитель без готовой идеи проходил квиз вместо пустой формы, чтобы страница не зависела от чужого CDN, и чтобы работа с деньгами авторов была юридически оформлена.

**Architecture:** SEO-слой целиком декларативный и живёт в App Router: `sitemap.ts`, `robots.ts`, `opengraph-image.tsx` и расширенный `generateMetadata` с `alternates.languages` — никакого рантайма и никаких зависимостей. Квиз — конечный автомат на `useReducer` с конфигурацией шагов в отдельном модуле, чтобы вопросы правились без трогания UI; результат уходит в существующий `/api/lead`. Юридические страницы — обычные маршруты вне слайд-деки. Медиа переезжают из чужого CDN в `public/`.

**Tech Stack:** Next.js 16 (App Router: Metadata API, file-based `sitemap`/`robots`, `ImageResponse`), React 19, next-intl, Tailwind CSS v4.

**Spec:** конкурентный аудит от 2026-08-13 (в этой сессии).

## Global Constraints

- **Зависит от P0:** Task 3 (квиз) отправляет данные в `POST /api/lead` и переиспользует `useLeadSubmit`. Без P0 эта задача блокируется. Остальные задачи независимы.
- **Никаких новых npm-зависимостей.** OG-картинка рисуется через встроенный в Next `ImageResponse`, не через внешний генератор.
- **Тест-раннера нет.** Верификация — `pnpm exec tsc --noEmit`, `pnpm exec eslint --max-warnings=0 <файлы>`, `pnpm build` и ручная проверка выдачи по URL.
- **`components/widgets/LiveCounter.tsx` не трогать.**
- **Перед написанием любого кода Metadata / sitemap / robots / ImageResponse — прочитать соответствующие страницы в `node_modules/next/dist/docs/`.** Этого требует `AGENTS.md`: в этой версии Next файловые конвенции и сигнатуры могли измениться, и именно эта задача состоит из них целиком.
- Копия юридических страниц — не изобретается разработчиком. См. «Required input from stakeholder».
- После правок `messages/*.json` — `node .claude/skills/i18n-parity-check/check-parity.js`.

## Required input from stakeholder

| Что | Задача |
|---|---|
| Боевой домен сайта | Task 1 (canonical, sitemap, OG) |
| Текст публичной оферты и политики обработки персональных данных, проверенные юристом. Реквизиты юрлица | Task 5 |
| Согласие на самохостинг hero-видео либо решение заменить их своей съёмкой | Task 4 |

---

## File Structure

Create:
- `lib/site.ts` — базовый URL и константы сайта, единственный источник правды для canonical/OG/sitemap.
- `app/sitemap.ts` — карта сайта с обеими локалями.
- `app/robots.ts` — robots.txt.
- `app/[locale]/opengraph-image.tsx` — генерируемая OG-картинка.
- `components/sections/Launch.tsx` — секция про прогрев и драматургию дропа.
- `lib/quizSteps.ts` — конфигурация шагов квиза.
- `components/quiz/Quiz.tsx` — UI квиза.
- `components/quiz/quizReducer.ts` — состояние квиза.
- `app/[locale]/legal/offer/page.tsx` — оферта.
- `app/[locale]/legal/privacy/page.tsx` — политика ПД.

Modify:
- `app/[locale]/layout.tsx` — `metadataBase`, `alternates.languages`, `openGraph`, JSON-LD.
- `lib/heroVideos.ts` — переход на локальные файлы.
- `components/motion/VideoTile.tsx` — атрибут `poster`.
- `components/sections/Contact.tsx` — ссылки на юридические страницы под формой.
- `lib/sections.ts`, `app/[locale]/page.tsx`, `messages/*.json` — через skill `new-section` для `Launch`.

---

### Task 1: SEO-пакет

**Files:**
- Create: `lib/site.ts`, `app/sitemap.ts`, `app/robots.ts`, `app/[locale]/opengraph-image.tsx`
- Modify: `app/[locale]/layout.tsx`

**Interfaces:**
- Produces: `SITE: { url: string; name: string }`.

Сейчас в `generateMetadata` только `title` и `description`. Ссылка на сайт, отправленная в Telegram или WhatsApp — а это основной канал для этой аудитории, — разворачивается голым текстом без картинки.

- [ ] **Step 1: Прочитать доки Next**

```bash
ls node_modules/next/dist/docs/
```

Прочитать страницы: Metadata API (`generateMetadata`, `alternates`, `openGraph`), file conventions `sitemap`, `robots`, `opengraph-image`. Следовать докам, а не коду ниже, если есть расхождение.

- [ ] **Step 2: Создать `lib/site.ts`**

Боевой домен взять у заказчика.

```ts
// Базовый URL сайта. Всё, что отдаёт абсолютные ссылки наружу — canonical,
// sitemap, OG — берёт его отсюда, чтобы домен не расползся по файлам.
export const SITE = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://lore.studio",
  name: "LORE",
} as const;
```

Дописать `NEXT_PUBLIC_SITE_URL=` в `.env.example`.

- [ ] **Step 3: Расширить `generateMetadata` в `app/[locale]/layout.tsx`**

Добавить к возвращаемому объекту:

```ts
metadataBase: new URL(SITE.url),
alternates: {
  canonical: `/${locale}`,
  languages: { ru: "/ru", en: "/en" },
},
openGraph: {
  type: "website",
  siteName: SITE.name,
  locale: locale === "ru" ? "ru_RU" : "en_US",
  url: `${SITE.url}/${locale}`,
  title: t("title"),
  description: t("description"),
},
twitter: { card: "summary_large_image" },
```

- [ ] **Step 4: Создать `app/[locale]/opengraph-image.tsx`**

Использовать `ImageResponse` из `next/og`, размер 1200×630. Композиция — тёмный фон под цвет сайта, вордмарк `LORE` крупным серифом и строка позиционирования. Не тянуть внешние шрифты по сети в рантайме: либо системный стек, либо шрифт, прочитанный из `node_modules` при сборке (см. доки Next по `ImageResponse` и шрифтам).

- [ ] **Step 5: Создать `app/sitemap.ts` и `app/robots.ts`**

`sitemap.ts` возвращает две записи (`/ru`, `/en`) с `alternates.languages`, плюс юридические страницы после Task 5. `robots.ts` разрешает всё, кроме `/api/`, и указывает `sitemap: ${SITE.url}/sitemap.xml`.

- [ ] **Step 6: Добавить JSON-LD**

В `app/[locale]/layout.tsx` внутри `<body>` — `<script type="application/ld+json">` с `Organization`: `name`, `url`, `logo`, `sameAs` (ссылки на соцсети и Telegram из `lib/contacts.ts`), `description`. Вставлять через `dangerouslySetInnerHTML` с `JSON.stringify` — это стандартная и единственная рабочая механика для JSON-LD в React.

- [ ] **Step 7: Проверки**

```bash
pnpm exec tsc --noEmit && pnpm exec eslint --max-warnings=0 lib/site.ts app/sitemap.ts app/robots.ts "app/[locale]/opengraph-image.tsx" "app/[locale]/layout.tsx" && pnpm build
```

- [ ] **Step 8: Ручная проверка выдачи**

На dev-сервере:

```bash
curl -s localhost:3000/sitemap.xml | head -20
curl -s localhost:3000/robots.txt
curl -s -o /dev/null -w "%{http_code} %{content_type}\n" localhost:3000/ru/opengraph-image
```

Ожидается: валидный XML с обоими локалями; robots со ссылкой на sitemap; `200 image/png`. Дополнительно открыть `/ru/opengraph-image` в браузере и убедиться, что картинка читаема, а не пустая.

- [ ] **Step 9: Коммит**

```bash
git add -A && git commit -m "feat: add SEO package — sitemap, robots, OG image, JSON-LD"
```

---

### Task 2: Секция про запуск и прогрев

**Files:**
- Create: `components/sections/Launch.tsx`
- Modify: `lib/sections.ts`, `app/[locale]/page.tsx`, `messages/ru.json`, `messages/en.json` (через skill)

**Зачем:** это единственный аргумент, который отделяет LORE от Fourthwall и Spring. Те дают витрину — но не дают продаж. Причём кейс Rhode на самом сайте уже сформулирован именно так: «год органического прогрева до запуска сформировал отложенный спрос». Значит, LORE понимает механику, но нигде не обещает её делать.

- [ ] **Step 1: Скаффолдить секцию**

Skill `new-section`: имя `Launch`, id `launch`, позиция — **сразу после `journey`** (путь продукта заканчивается доставкой, дальше — как этот путь вообще начинает продаваться).

- [ ] **Step 2: Написать копию**

Четыре фазы дропа, по образцу трёхактной структуры `journey`: прогрев до анонса, анонс и сбор предзаказов, окно продаж, повторный контакт с купившими. В каждой фазе — что делает автор и что делаем мы. Явно сказать то, чего не говорит ни один конкурент: тихий запуск не продаёт, и мы отвечаем за драматургию, а не только за коробки.

- [ ] **Step 3: Сверстать**

Переиспользовать структуру `components/sections/Journey.tsx` (нумерованные акты) — не изобретать новый макет, дека и так длинная.

- [ ] **Step 4: Проверки**

```bash
node .claude/skills/i18n-parity-check/check-parity.js && pnpm exec tsc --noEmit && pnpm exec eslint --max-warnings=0 components/sections/Launch.tsx lib/sections.ts "app/[locale]/page.tsx"
```

- [ ] **Step 5: Ручная проверка и коммит**

```bash
git add -A && git commit -m "feat: add launch and audience warm-up section"
```

---

### Task 3: Квиз подбора продукта

**Files:**
- Create: `lib/quizSteps.ts`, `components/quiz/quizReducer.ts`, `components/quiz/Quiz.tsx`
- Modify: `components/sections/ProductDiscovery.tsx`, `messages/ru.json`, `messages/en.json`

**Interfaces:**
- Consumes: `useLeadSubmit` из `components/forms/useLeadSubmit.ts` (P0 Task 5).
- Produces: `QUIZ_STEPS: readonly QuizStep[]`, `type QuizState`, `quizReducer(state, action)`.

Секция `ProductDiscovery` уже обещает «мы придумаем, какой продукт вам стоит продавать» и перечисляет четыре аналитических шага. Квиз — это то же обещание, но исполняемое прямо на странице: он даёт посетителю ощущение, что подбор уже начался, и берёт контакт в момент максимального интереса, а не «просто заполните форму».

- [ ] **Step 1: Спроектировать шаги в `lib/quizSteps.ts`**

Четыре вопроса, зеркалящие `productDiscovery.analysisSteps`:

```ts
export type QuizStep = {
  id: "niche" | "audience" | "engagement" | "budget";
  /** Ключ в messages: quiz.steps.<id>.question */
  options: readonly string[];
};

export const QUIZ_STEPS: readonly QuizStep[] = [
  { id: "niche", options: ["beauty", "lifestyle", "gaming", "education", "other"] },
  { id: "audience", options: ["lt50k", "50k-200k", "200k-1m", "gt1m"] },
  { id: "engagement", options: ["low", "medium", "high"] },
  { id: "budget", options: ["none", "some", "ready"] },
] as const;
```

Тексты вопросов и опций — в `messages/*.json` под namespace `quiz`, связь по этим id.

- [ ] **Step 2: Создать `components/quiz/quizReducer.ts`**

```ts
import { QUIZ_STEPS } from "@/lib/quizSteps";

export type QuizState = {
  stepIndex: number;
  answers: Record<string, string>;
  done: boolean;
};

export type QuizAction =
  | { type: "answer"; stepId: string; value: string }
  | { type: "back" }
  | { type: "reset" };

export const initialQuizState: QuizState = {
  stepIndex: 0,
  answers: {},
  done: false,
};

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "answer": {
      const answers = { ...state.answers, [action.stepId]: action.value };
      const next = state.stepIndex + 1;
      return {
        answers,
        stepIndex: Math.min(next, QUIZ_STEPS.length - 1),
        done: next >= QUIZ_STEPS.length,
      };
    }
    case "back":
      return { ...state, stepIndex: Math.max(0, state.stepIndex - 1), done: false };
    case "reset":
      return initialQuizState;
  }
}
```

- [ ] **Step 3: Прогнать редьюсер**

```bash
node --experimental-strip-types -e '
Promise.all([import("./components/quiz/quizReducer.ts"), import("./lib/quizSteps.ts")]).then(([r, s]) => {
  let st = r.initialQuizState;
  for (const step of s.QUIZ_STEPS) st = r.quizReducer(st, { type: "answer", stepId: step.id, value: "x" });
  console.log(st.done, Object.keys(st.answers).length);
  console.log(r.quizReducer(r.initialQuizState, { type: "back" }).stepIndex);
});'
```

Ожидается: `true 4` — квиз завершается ровно после последнего шага и собирает все ответы; `0` — «назад» с первого шага не уходит в отрицательный индекс. Если раннер недоступен — проверить те же два случая руками в браузере на Step 6, не пропуская.

- [ ] **Step 4: Собрать `components/quiz/Quiz.tsx`**

Один вопрос на экране, варианты — крупные кликабельные строки в стиле `Benefits.tsx`, индикатор прогресса «шаг N из 4», кнопка «назад». На финальном экране — поле контакта и отправка через `useLeadSubmit` с `channel: "telegram"`, `source: "quiz"`, `name: "Без имени"`; ответы складываются в `message` человекочитаемой строкой, чтобы в Telegram приходил готовый бриф. `channel` и `name` обязательны: без них `validateLead` вернёт 400 — см. `lib/leadPayload.ts` в P0 Task 2. Переходы между шагами — `AnimatePresence` из framer-motion, как в `FloatingCapture.tsx`.

- [ ] **Step 5: Встроить квиз в `ProductDiscovery.tsx`**

Не создавать новую секцию: квиз — это исполнение обещания, которое `ProductDiscovery` уже даёт. Добавить его под существующим блоком `analysisSteps`, заменив статичную концовку `bottomAccent` на живой первый вопрос.

- [ ] **Step 6: Проверки**

```bash
node .claude/skills/i18n-parity-check/check-parity.js && pnpm exec tsc --noEmit && pnpm exec eslint --max-warnings=0 lib/quizSteps.ts components/quiz/quizReducer.ts components/quiz/Quiz.tsx components/sections/ProductDiscovery.tsx
```

- [ ] **Step 7: Ручная проверка**

Пройти квиз целиком в обеих локалях. Проверить: «назад» работает и не теряет ответы, на финале отправка уходит и в Telegram приходит сообщение с `Блок: quiz` и всеми четырьмя ответами в читаемом виде, повторное прохождение после `reset` работает.

- [ ] **Step 8: Коммит**

```bash
git add -A && git commit -m "feat: add product discovery quiz"
```

---

### Task 4: Самохостинг медиа и постеры

**Files:**
- Modify: `lib/heroVideos.ts`, `components/motion/VideoTile.tsx`
- Modify: `lib/showcaseVideos.ts`, `lib/productionVideos.ts`, `lib/marketCaseVideos.ts`

Сейчас первый экран сайта тянет три видео с `static.higgsfield.ai` — чужого CDN, который в любой момент может отдать 404 или перестать пускать hotlink. Это единственная внешняя зависимость рантайма на всём лендинге, и она стоит ровно в hero.

- [ ] **Step 1: Инвентаризовать внешние ссылки**

```bash
grep -rn "higgsfield\|https://" lib/heroVideos.ts lib/showcaseVideos.ts lib/productionVideos.ts lib/marketCaseVideos.ts
```

Выписать полный список хотлинков.

- [ ] **Step 2: Решить судьбу каждого файла**

Согласовать с заказчиком: заменить своей съёмкой (предпочтительно) или скачать и захостить у себя. Если это чужой контент — убедиться, что права на использование есть; при отсутствии прав файл заменяется, а не перекладывается к себе. Это блокирующий вопрос: молча копировать чужие маркетинговые ассеты на свой домен нельзя.

- [ ] **Step 3: Положить файлы локально**

Согласованные файлы — в `public/media/hero/` и т.д., затем обновить массивы в `lib/*Videos.ts` на локальные пути. Внешних `https://` в этих файлах остаться не должно.

- [ ] **Step 4: Добавить постеры**

Сгенерировать по первому кадру каждого видео:

```bash
for f in public/media/hero/*.mp4; do ffmpeg -y -i "$f" -vframes 1 -q:v 3 "${f%.mp4}.jpg"; done
```

Если `ffmpeg` не установлен — не пропускать шаг: запросить постеры у заказчика или установить ffmpeg. Без `poster` первый экран показывает чёрный прямоугольник до загрузки видео.

- [ ] **Step 5: Прокинуть `poster` в `VideoTile`**

Добавить необязательный проп `poster?: string` и повесить его на `<video poster={poster}>`. Не менять существующие вызовы там, где постера нет — проп необязательный.

- [ ] **Step 6: Проверки**

```bash
grep -rn "https://" lib/heroVideos.ts lib/showcaseVideos.ts lib/productionVideos.ts lib/marketCaseVideos.ts; echo "--- пусто = ок ---"
pnpm exec tsc --noEmit && pnpm exec eslint --max-warnings=0 lib/heroVideos.ts components/motion/VideoTile.tsx
du -sh public/
```

Ожидается: внешних ссылок нет; проверки зелёные; размер `public/` осознан и приемлем (сейчас 42 МБ, рост надо контролировать).

- [ ] **Step 7: Ручная проверка**

Открыть страницу с throttling «Slow 3G» в DevTools. Убедиться, что hero показывает постер, а не пустоту, и что во вкладке Network нет обращений к внешним доменам за видео.

- [ ] **Step 8: Коммит**

```bash
git add -A && git commit -m "chore: self-host video assets and add posters"
```

---

### Task 5: Юридические страницы

**Files:**
- Create: `app/[locale]/legal/offer/page.tsx`, `app/[locale]/legal/privacy/page.tsx`
- Modify: `components/sections/Contact.tsx`, `app/sitemap.ts`, `messages/ru.json`, `messages/en.json`

LORE принимает оплату от покупателей и выплачивает долю авторам. Форма собирает персональные данные. Ни оферты, ни политики ПД на сайте нет — это не косметика, а условие легальности приёма платежей и обработки данных.

- [ ] **Step 1: Получить тексты**

Запросить у заказчика тексты оферты и политики обработки ПД, **проверенные юристом**, плюс реквизиты юрлица. Разработчик эти тексты не пишет и не генерирует — юридический документ, сочинённый ИИ или разработчиком, хуже, чем его отсутствие, потому что создаёт ложную уверенность.

- [ ] **Step 2: Создать маршруты**

Обе страницы — вне слайд-деки, обычная типографика в колонке максимум ~760px. Не добавлять их в `SLIDE_IDS`. Каждая экспортирует свой `generateMetadata` с `title` и `robots: { index: false }` — юридические страницы не должны конкурировать с лендингом в выдаче.

- [ ] **Step 3: Добавить ссылки под формой**

В `components/sections/Contact.tsx` под кнопкой отправки — строка мелким шрифтом: «Отправляя форму, вы соглашаетесь с [политикой обработки данных]». Ссылка через `Link` из `@/i18n/navigation` (не `next/link`), чтобы локаль сохранялась. Обе ссылки — оферта и политика — также в футере секции.

- [ ] **Step 4: Добавить страницы в sitemap**

Дописать `/ru/legal/offer`, `/en/legal/offer`, `/ru/legal/privacy`, `/en/legal/privacy` в `app/sitemap.ts` с низким `priority`.

- [ ] **Step 5: Проверки**

```bash
node .claude/skills/i18n-parity-check/check-parity.js && pnpm exec tsc --noEmit && pnpm exec eslint --max-warnings=0 "app/[locale]/legal/offer/page.tsx" "app/[locale]/legal/privacy/page.tsx" components/sections/Contact.tsx app/sitemap.ts && pnpm build
```

- [ ] **Step 6: Ручная проверка**

Открыть `/ru/legal/offer`, `/en/legal/privacy` и остальные комбинации — все четыре отдают 200 и читаемы. Кликнуть ссылки из формы — переход сохраняет локаль. Проверить, что страницы появились в `/sitemap.xml`.

- [ ] **Step 7: Коммит**

```bash
git add -A && git commit -m "feat: add offer and privacy policy pages"
```

---

### Task 6: Финальная приёмка P2

- [ ] **Step 1: Полная проверка**

```bash
pnpm exec tsc --noEmit && pnpm exec eslint --max-warnings=0 . && node .claude/skills/i18n-parity-check/check-parity.js && pnpm build
```

- [ ] **Step 2: Проверить SEO-выдачу на собранном приложении**

```bash
pnpm start &
sleep 5
curl -s localhost:3000/sitemap.xml
curl -s localhost:3000/robots.txt
curl -s localhost:3000/ru | grep -o '<meta[^>]*og:[^>]*>' | head
curl -s localhost:3000/ru | grep -o 'hreflang="[a-z]*"'
```

Ожидается: sitemap содержит 6 URL (2 локали лендинга + 4 юридические), robots ссылается на sitemap, в разметке присутствуют OG-теги и hreflang для обеих локалей.

- [ ] **Step 3: Проверить превью ссылки**

Прогнать боевой URL через любой валидатор OG-разметки и убедиться, что карточка показывает картинку, заголовок и описание. До деплоя — проверить локально, что `/ru/opengraph-image` отдаёт корректный PNG.

- [ ] **Step 4: Коммит**

```bash
git add -A && git commit -m "chore: P2 acceptance fixes"
```
