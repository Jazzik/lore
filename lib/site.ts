// Базовый URL сайта. Всё, что отдаёт абсолютные ссылки наружу — canonical,
// sitemap, robots, OG — берёт его отсюда, чтобы домен не расползся по файлам.
//
// Порядок разрешения: явно заданный боевой домен → домен, который Vercel
// подставляет на продовом деплое → localhost для разработки. Пока домен не
// куплен, прод работает на втором варианте: ссылки остаются абсолютными и
// валидными, а переезд на свой домен — это одна переменная в настройках, а
// не правка кода.
//
// Читается только на сервере (metadata, sitemap, robots, OG). Клиентским
// компонентам SITE.url не нужен; если понадобится — брать NEXT_PUBLIC_SITE_URL
// напрямую, потому что VERCEL_PROJECT_PRODUCTION_URL в браузер не попадает.
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const SITE = {
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000"),
  name: "LORE",
} as const;
