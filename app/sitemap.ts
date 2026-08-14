import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE } from "@/lib/site";

// Лендинг — одна страница на локаль. Каждая запись перечисляет все языковые
// версии в alternates, чтобы поисковик не считал их дублями друг друга.
const languages = {
  ...Object.fromEntries(
    routing.locales.map((locale) => [locale, `${SITE.url}/${locale}`]),
  ),
  "x-default": `${SITE.url}/${routing.defaultLocale}`,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routing.locales.map((locale) => ({
    url: `${SITE.url}/${locale}`,
    lastModified,
    changeFrequency: "weekly",
    priority: locale === routing.defaultLocale ? 1 : 0.8,
    alternates: { languages },
  }));
}
