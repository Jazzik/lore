# P1 — Trust & Conversion Sections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Закрыть доказательный разрыв с конкурентами: показать собственные кейсы, снять возражения в FAQ, дать посетителю посчитать свой доход, и убрать противоречие между позиционированием «не очередная футболка с логотипом» и витриной, которая показывает ровно эти футболки.

**Architecture:** Пять новых слайд-секций по уже существующему паттерну репозитория (`min-h-svh` секция + `Reveal` + `useTranslations` + запись в `SLIDE_IDS`) плюс переработка контента существующей `Showcase`. Единственный нетривиальный компонент — калькулятор экономики: чистая функция расчёта в `lib/economics.ts`, отдельно от UI, чтобы формулу можно было править и проверять без React. Скаффолдинг новых секций делается через репозиторный skill `new-section`, а не вручную.

**Tech Stack:** Next.js 16 (App Router), React 19, next-intl, framer-motion, Tailwind CSS v4, `@base-ui/react` (уже используется в `components/ui/*`).

**Spec:** конкурентный аудит от 2026-08-13 (в этой сессии). Требования зафиксированы в Global Constraints и в тексте задач.

## Global Constraints

- **Зависит от P0** только организационно (общая ветка), технически — нет. Может исполняться параллельно, но калькулятор в Task 5 переиспользует `useLeadSubmit` из P0 Task 5; если P0 не сделан, эта часть Task 5 блокируется.
- **Никаких новых npm-зависимостей.**
- **Тест-раннера в репозитории нет.** Верификация — `pnpm exec tsc --noEmit` + `pnpm exec eslint --max-warnings=0 <файлы>` + ручной прогон в браузере. Исключение — `lib/economics.ts` в Task 5: там чистая функция, и для неё в плане прописан прогон через `node --experimental-strip-types`.
- **`components/widgets/LiveCounter.tsx` не трогать.**
- **Новые секции создаются через skill `new-section`** (`.claude/skills/new-section/SKILL.md`), который сам добавляет id в `lib/sections.ts`, ключи в обе локали и элемент в `app/[locale]/page.tsx`. Не воспроизводить эти шаги руками.
- Вся копия — реальный финальный текст RU и EN. После каждой правки `messages/*.json` — `node .claude/skills/i18n-parity-check/check-parity.js`.
- Порядок ключей в `messages/*.json` должен соответствовать порядку `SLIDE_IDS` — это конвенция репозитория, а не косметика.
- Тон копии — как в соседних секциях: короткие строки, серифный акцент через `<em className="italic text-rose">`, без маркетингового пафоса.

## Required input from stakeholder

Без этих данных задачи 1, 4 и 6 нельзя завершить честно — выдумывать цифры и клиентов нельзя ни при каких условиях.

| Что | Задача |
|---|---|
| 1–3 реальных кейса: автор, размер аудитории, продукт, тираж, срок запуска, выручка/проданных единиц. Разрешение автора на публикацию имени | Task 1 |
| Если публичных кейсов ещё нет — согласованная формулировка «пилот в работе» с теми цифрами, которые раскрывать можно | Task 1 |
| Реальные параметры экономики: типичная конверсия аудитории в покупку, средний чек, доля автора по каждой из трёх финмоделей | Task 5 |
| Фото производства/продукции: макро швов, печати, материалов. Названия материалов и технологий нанесения | Task 4 |
| Состав команды, год основания, юрлицо, город производства, 3–4 числа о себе | Task 6 |

---

## File Structure

Create:
- `components/sections/Cases.tsx` — собственные кейсы LORE.
- `components/sections/Quality.tsx` — материалы, контроль качества, бесплатный образец.
- `components/sections/Faq.tsx` — аккордеон возражений.
- `components/sections/Calculator.tsx` — UI калькулятора дохода.
- `components/sections/About.tsx` — команда, производство, цифры о себе.
- `lib/economics.ts` — чистая формула расчёта дохода автора, без React.
- `lib/caseStudies.ts` — данные кейсов (числа отдельно от переводимой копии).
- `lib/qualityImages.ts` — пути к фото производства, по образцу `lib/floatingImages.ts`.

Modify:
- `components/sections/Showcase.tsx` — переработка витрины.
- `lib/showcaseVideos.ts` — пересборка списка под новую витрину.
- `lib/sections.ts`, `app/[locale]/page.tsx`, `messages/ru.json`, `messages/en.json` — через skill `new-section`.

---

### Task 1: Секция собственных кейсов

**Files:**
- Create: `lib/caseStudies.ts`
- Create: `components/sections/Cases.tsx`
- Modify: `lib/sections.ts`, `app/[locale]/page.tsx`, `messages/ru.json`, `messages/en.json` (через skill)

**Interfaces:**
- Produces: `type CaseStudy = { id: string; audience: string; units: string; leadTime: string; revenue: string }`, `CASE_STUDIES: readonly CaseStudy[]`.

Числа лежат в `lib/caseStudies.ts`, а не в `messages/*.json`, потому что они одинаковы в обеих локалях и не должны разъезжаться при переводе. Переводимый текст (имя автора в кириллице/латинице, описание продукта, подписи полей) — в `messages`, связь по `id`.

- [ ] **Step 1: Получить данные кейсов**

Запросить у заказчика данные из блока «Required input from stakeholder». **Если реальных кейсов нет — не выдумывать и не заимствовать чужие.** Согласовать честный вариант: один пилотный проект с теми цифрами, которые можно раскрыть. Если и этого нет — остановить задачу и сообщить, что секция не может быть сделана честно; остальные задачи плана при этом продолжаются.

- [ ] **Step 2: Создать `lib/caseStudies.ts`**

```ts
// Цифры кейсов. Живут отдельно от messages/*.json намеренно: они одинаковы
// в обеих локалях, и им нельзя разъезжаться при переводе. Переводимый текст
// (имя, описание продукта) лежит в messages под тем же id.
export type CaseStudy = {
  id: string;
  /** Размер аудитории на момент запуска, как показываем: "480K". */
  audience: string;
  /** Продано единиц: "1 200". */
  units: string;
  /** От брифа до первой отгрузки: "6 недель". */
  leadTime: string;
  /** Выручка проекта: "4,1 млн ₽". */
  revenue: string;
};

export const CASE_STUDIES: readonly CaseStudy[] = [
  // Заполнить реальными данными из Step 1.
] as const;
```

- [ ] **Step 3: Скаффолдить секцию**

Вызвать skill `new-section` со входом: имя `Cases`, id `cases`, позиция — **сразу после `market-cases`** (сначала чужие бренды как контекст рынка, затем свои как доказательство).

- [ ] **Step 4: Наполнить `components/sections/Cases.tsx`**

Верстать по образцу `components/sections/Benefits.tsx` (нумерованная сетка). На каждый кейс — имя автора крупно серифом, под ним четыре метрики в строку с подписями `t("labels.audience")` и т.д., значения — из `CASE_STUDIES` по `id`. Заголовок секции подаёт контраст с предыдущей: чужие бренды показали рынок, дальше — что сделали мы.

- [ ] **Step 5: Проверки**

```bash
node .claude/skills/i18n-parity-check/check-parity.js && pnpm exec tsc --noEmit && pnpm exec eslint --max-warnings=0 components/sections/Cases.tsx lib/caseStudies.ts lib/sections.ts "app/[locale]/page.tsx"
```

- [ ] **Step 6: Ручная проверка**

Открыть `/ru` и `/en`, доскроллить до секции. Проверить: секция появилась в правой навигации `ProgressNav`, цифры совпадают с данными от заказчика, обе локали переведены.

- [ ] **Step 7: Коммит**

```bash
git add -A && git commit -m "feat: add own case studies section"
```

---

### Task 2: FAQ

**Files:**
- Create: `components/sections/Faq.tsx`
- Modify: `lib/sections.ts`, `app/[locale]/page.tsx`, `messages/ru.json`, `messages/en.json` (через skill)

**Interfaces:**
- Consumes: `Accordion` из `@base-ui/react`, если он там есть; иначе — нативный `<details>/<summary>` (см. Step 2).
- Produces: ничего.

Это самая дешёвая по трудозатратам и самая крупная по эффекту задача плана: FAQ есть у обоих прямых RU-конкурентов и у Fourthwall, у LORE — нет.

- [ ] **Step 1: Скаффолдить секцию**

Skill `new-section`: имя `Faq`, id `faq`, позиция — **перед `contact`** (последнее возражение снимается прямо перед формой).

- [ ] **Step 2: Выбрать механику аккордеона**

```bash
ls node_modules/@base-ui/react/ | grep -i accordion
```

Если `Accordion` есть — использовать его, как `Tabs` уже используется в `Contact.tsx`. Если нет — нативный `<details>/<summary>` с `group-open:` утилитами Tailwind. **Не добавлять новую зависимость** и не писать свой аккордеон на `useState`, если хватает нативного.

- [ ] **Step 3: Написать копию FAQ**

Десять вопросов, по одному на каждое возражение, найденное в аудите. Формулировки вопросов — от лица автора, ответы — конкретные, с цифрами там, где они есть:

1. Сколько это стоит и когда я плачу?
2. Что будет, если продукт не продастся?
3. Какой минимальный тираж?
4. Сколько времени от старта до первой отгрузки?
5. Кому принадлежит бренд и дизайн?
6. Как считается моя доля и когда выплаты?
7. Что с возвратами и браком?
8. Можно получить образец до запуска тиража?
9. Что вы делаете, если у меня нет идеи продукта?
10. Какая аудитория нужна, чтобы это имело смысл?

Ответы согласовать с заказчиком — часть из них содержит коммерческие условия, которые нельзя придумывать. Ответы, для которых условий пока нет, не выдумывать: сократить список до тех, на которые есть реальный ответ.

- [ ] **Step 4: Сверстать секцию**

Список вопросов в один столбец, максимальная ширина ~840px, вопрос — `text-lg` в основном шрифте, ответ — `text-sm text-muted-ink`. Разделители — `border-t border-line`, как в `Contact.tsx`. Раскрытый пункт помечается акцентом `text-rose`.

- [ ] **Step 5: Проверки**

```bash
node .claude/skills/i18n-parity-check/check-parity.js && pnpm exec tsc --noEmit && pnpm exec eslint --max-warnings=0 components/sections/Faq.tsx lib/sections.ts "app/[locale]/page.tsx"
```

- [ ] **Step 6: Ручная проверка**

Открыть секцию в браузере. Проверить: раскрытие/схлопывание работает мышью и с клавиатуры (Tab + Enter), на мобильной ширине (375px) текст не выезжает, обе локали переведены.

- [ ] **Step 7: Коммит**

```bash
git add -A && git commit -m "feat: add FAQ section"
```

---

### Task 3: Переработка витрины

**Files:**
- Modify: `components/sections/Showcase.tsx`
- Modify: `lib/showcaseVideos.ts`
- Modify: `messages/ru.json`, `messages/en.json`

**Interfaces:**
- Consumes: `VideoGrid`, `VideoTile` (уже существуют).
- Produces: ничего.

**Зачем:** сейчас `positioning.note` говорит «для тех, кто устал от футболок с логотипом», а `showcase.items` перечисляет «Худи, Кепка, Термокружка, Тоут-бэг, Постер, Пины, Свеча» — ровно тот generic-мерч. Страница спорит сама с собой, и посетитель верит списку, а не слогану.

- [ ] **Step 1: Согласовать новый список объектов**

Заменить категории на конкретные нестандартные объекты, которые LORE реально может произвести. Ориентир — вещи, у которых есть своя причина существовать помимо логотипа: настольная игра, парфюм, соус, книга, лампа, скейт-дек, набор для ухода. Финальный список согласовать с заказчиком по критерию «мы это действительно можем сделать».

- [ ] **Step 2: Обновить копию в `messages/ru.json` и `messages/en.json`**

В namespace `showcase` заменить массив `items` на согласованный список. Строка `body` тоже переписывается: «От худи до термокружки» прямо противоречит новому позиционированию.

Новый `body` (RU): `Не логотип на футболке, а вещь, которая имеет право на существование сама по себе.`
Новый `body` (EN): `Not a logo on a t-shirt — an object that earns its place on its own.`

- [ ] **Step 3: Синхронизировать `lib/showcaseVideos.ts`**

Длина массива `SHOWCASE_VIDEOS` должна совпадать с длиной `showcase.items` — это зафиксировано комментарием в самом файле. Если объектов стало другое количество, привести массив в соответствие. Реального видео на новые объекты может не быть: тогда оставить существующие плейсхолдеры и **не увеличивать** список сверх того, на что есть хоть какой-то визуал.

- [ ] **Step 4: Проверки**

```bash
node .claude/skills/i18n-parity-check/check-parity.js && pnpm exec tsc --noEmit && pnpm exec eslint --max-warnings=0 components/sections/Showcase.tsx lib/showcaseVideos.ts
```

- [ ] **Step 5: Ручная проверка**

Открыть секцию. Убедиться, что число подписей равно числу плиток и ни одна плитка не осталась без подписи или наоборот.

- [ ] **Step 6: Коммит**

```bash
git add -A && git commit -m "fix: align showcase with positioning, drop generic merch list"
```

---

### Task 4: Секция качества

**Files:**
- Create: `lib/qualityImages.ts`
- Create: `components/sections/Quality.tsx`
- Modify: `lib/sections.ts`, `app/[locale]/page.tsx`, `messages/ru.json`, `messages/en.json` (через skill)

**Interfaces:**
- Produces: `QUALITY_IMAGES: readonly string[]`.

Закрывает подтверждённую ресёрчем боль: главный страх автора — выцветший принт и кривой шов **под его именем**. Конкурент Showcase бьёт это бесплатным образцом «уже завтра».

- [ ] **Step 1: Получить фотоматериал**

Запросить макро-фото швов, печати, материалов. Положить в `public/media/quality/`. Если реальных фото нет — задача останавливается: секция про качество на стоковых картинках работает против себя.

- [ ] **Step 2: Создать `lib/qualityImages.ts`**

По образцу `lib/floatingImages.ts` — просто массив путей с комментарием о происхождении файлов.

- [ ] **Step 3: Скаффолдить секцию**

Skill `new-section`: имя `Quality`, id `quality`, позиция — **сразу после `production`** (сначала как делаем, потом из чего и с каким контролем).

- [ ] **Step 4: Наполнить секцию**

Три смысловых блока: материалы и технологии нанесения (конкретные названия, не «высокое качество»); что именно проверяем перед отгрузкой; предложение бесплатного образца до запуска тиража. Фото — сеткой рядом. CTA блока с образцом ведёт на `#contact` через существующий `scrollToSection` из `lib/scrollToSection.ts`.

- [ ] **Step 5: Проверки**

```bash
node .claude/skills/i18n-parity-check/check-parity.js && pnpm exec tsc --noEmit && pnpm exec eslint --max-warnings=0 components/sections/Quality.tsx lib/qualityImages.ts lib/sections.ts "app/[locale]/page.tsx"
```

- [ ] **Step 6: Ручная проверка**

Проверить: изображения грузятся через `next/image` с корректными `sizes`, секция не ломает вёрстку на 375px, CTA скроллит к форме.

- [ ] **Step 7: Коммит**

```bash
git add -A && git commit -m "feat: add quality and materials section"
```

---

### Task 5: Калькулятор экономики

**Files:**
- Create: `lib/economics.ts`
- Create: `components/sections/Calculator.tsx`
- Modify: `lib/sections.ts`, `app/[locale]/page.tsx`, `messages/ru.json`, `messages/en.json` (через skill)

**Interfaces:**
- Consumes: `useLeadSubmit` из `components/forms/useLeadSubmit.ts` (P0 Task 5).
- Produces: `type Model = "percent" | "preorder" | "author"`, `type Estimate = { buyers: number; revenue: number; authorIncome: number }`, `estimate(input: { audience: number; conversionRate: number; averageOrder: number; model: Model }): Estimate`.

Сейчас `FinancialModel` — три абзаца текста без единой цифры. Калькулятор превращает абстрактное «вы получаете процент» в конкретное число на экране посетителя и заодно даёт естественный повод оставить контакт.

- [ ] **Step 1: Получить реальные параметры**

Запросить у заказчика: типичную конверсию аудитории в покупку, диапазон среднего чека, долю автора по каждой из трёх моделей из `financialModel.columns`. **Формула, врущая в пользу продавца, дороже отсутствия калькулятора** — брать консервативные значения.

- [ ] **Step 2: Создать `lib/economics.ts`**

```ts
// Расчёт дохода автора. Чистая функция без React: формулу правит заказчик,
// и её должно быть можно проверить прогоном, не поднимая браузер.

export type Model = "percent" | "preorder" | "author";

export type Estimate = {
  buyers: number;
  revenue: number;
  authorIncome: number;
};

/** Доля автора по каждой модели. Значения подставить из Step 1. */
const AUTHOR_SHARE: Record<Model, number> = {
  percent: 0,
  preorder: 0,
  author: 0,
};

export function estimate(input: {
  audience: number;
  /** Доля аудитории, доходящая до покупки, как 0.01 = 1%. */
  conversionRate: number;
  averageOrder: number;
  model: Model;
}): Estimate {
  const audience = Math.max(0, Math.floor(input.audience));
  const rate = Math.min(Math.max(input.conversionRate, 0), 1);
  const average = Math.max(0, input.averageOrder);

  const buyers = Math.floor(audience * rate);
  const revenue = Math.round(buyers * average);
  const authorIncome = Math.round(revenue * AUTHOR_SHARE[input.model]);

  return { buyers, revenue, authorIncome };
}
```

- [ ] **Step 3: Прогнать формулу**

```bash
node --experimental-strip-types -e '
import("./lib/economics.ts").then(({ estimate }) => {
  console.log(estimate({ audience: 100000, conversionRate: 0.005, averageOrder: 3500, model: "percent" }));
  console.log(estimate({ audience: 0, conversionRate: 0.005, averageOrder: 3500, model: "percent" }));
  console.log(estimate({ audience: 100000, conversionRate: 5, averageOrder: 3500, model: "percent" }));
});'
```

Ожидается: первый вызов — `buyers: 500`, ненулевые `revenue` и `authorIncome`; второй — все нули без `NaN`; третий — `conversionRate` зажат до 1, `buyers: 100000` (проверка, что мусорный ввод не даёт абсурда). Если `--experimental-strip-types` недоступен в установленной версии Node — проверить те же три случая через временный вызов в компоненте на dev-сервере, а не пропускать шаг.

- [ ] **Step 4: Скаффолдить секцию**

Skill `new-section`: имя `Calculator`, id `calculator`, позиция — **сразу после `financial-model`**.

- [ ] **Step 5: Собрать UI**

Три контрола: размер аудитории (`<input type="range">` с логарифмической шкалой либо числовой ввод), средний чек, выбор модели — переиспользовать `Tabs` из `components/ui/tabs.tsx`, как в `Contact.tsx`. Конверсия не выводится в UI: это наш параметр, а не пользовательский, иначе посетитель накрутит себе любую цифру и калькулятор перестанет что-либо значить.

Результат — крупным серифом, `authorIncome` акцентом `text-rose`. Под результатом обязательная оговорка мелким шрифтом: расчёт оценочный, не оферта.

Под результатом — поле контакта и кнопка, отправляющие заявку через `useLeadSubmit` с `channel: "telegram"`, `source: "calculator"`, `name: "Без имени"` и параметрами расчёта в `message`, чтобы в Telegram приходил не голый хэндл, а контекст. `channel`, `name` и `hp` обязательны: `LeadPayload` требует все шесть полей, иначе не скомпилируется, а без `channel`/`name` `validateLead` вернёт 400 — см. `lib/leadPayload.ts` в P0 Task 2. Honeypot `hp` здесь такой же скрытый инпут, как в `FloatingCapture.tsx`: без него форма остаётся открытой для ботов. Поле контакта требует минимум 3 символа.

- [ ] **Step 6: Проверки**

```bash
node .claude/skills/i18n-parity-check/check-parity.js && pnpm exec tsc --noEmit && pnpm exec eslint --max-warnings=0 components/sections/Calculator.tsx lib/economics.ts lib/sections.ts "app/[locale]/page.tsx"
```

- [ ] **Step 7: Ручная проверка**

Подвигать ползунки — число пересчитывается без задержки и не показывает `NaN` в крайних положениях. Переключить модель — результат меняется. Отправить заявку — в Telegram приходит сообщение с `Блок: calculator` и параметрами расчёта.

- [ ] **Step 8: Коммит**

```bash
git add -A && git commit -m "feat: add income calculator section"
```

---

### Task 6: Секция «Кто мы»

**Files:**
- Create: `components/sections/About.tsx`
- Modify: `lib/sections.ts`, `app/[locale]/page.tsx`, `messages/ru.json`, `messages/en.json` (через skill)

- [ ] **Step 1: Получить данные**

Запросить: состав команды с ролями, год основания, юрлицо, город производства, 3–4 числа о себе (проектов, единиц произведено, партнёров-фабрик, лет опыта). Числа брать только реальные.

- [ ] **Step 2: Скаффолдить секцию**

Skill `new-section`: имя `About`, id `about`, позиция — **перед `faq`**.

- [ ] **Step 3: Наполнить**

Строка из 3–4 чисел крупным серифом с подписями (по образцу метрик Genflow и Fourthwall — это ровно то, чего у LORE нет и что есть у всех сравниваемых). Ниже — короткий абзац о команде и производстве. Юрлицо и город — мелким шрифтом в конце секции.

- [ ] **Step 4: Проверки**

```bash
node .claude/skills/i18n-parity-check/check-parity.js && pnpm exec tsc --noEmit && pnpm exec eslint --max-warnings=0 components/sections/About.tsx lib/sections.ts "app/[locale]/page.tsx"
```

- [ ] **Step 5: Ручная проверка и коммит**

Проверить обе локали, затем:

```bash
git add -A && git commit -m "feat: add about section with company numbers"
```

---

### Task 7: Финальная приёмка P1

- [ ] **Step 1: Полная проверка**

```bash
pnpm exec tsc --noEmit && pnpm exec eslint --max-warnings=0 . && node .claude/skills/i18n-parity-check/check-parity.js && pnpm build
```

- [ ] **Step 2: Проверить порядок деки**

Открыть `lib/sections.ts` и `app/[locale]/page.tsx`. Порядок `SLIDE_IDS`, порядок элементов в `<main>` и порядок namespace'ов в `messages/*.json` должны совпадать. Ожидаемая итоговая дека:

`hero → positioning → showcase → differentiation → services → production → quality → journey → product-discovery → benefits → financial-model → calculator → market-cases → cases → about → faq → contact`

- [ ] **Step 3: Прогнать всю страницу целиком**

Проскроллить `/ru` и `/en` от начала до конца на десктопе (1280px) и на мобильной ширине (375px). Проверить: `ProgressNav` показывает все 17 секций и подсвечивает активную, нигде нет горизонтального скролла, нигде не видно ключей вместо перевода.

- [ ] **Step 4: Снять скриншоты новых секций**

Приложить к отчёту скриншоты `cases`, `quality`, `calculator`, `about`, `faq` в обеих локалях.

- [ ] **Step 5: Коммит**

```bash
git add -A && git commit -m "chore: P1 acceptance fixes"
```
