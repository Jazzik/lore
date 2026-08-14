import type { Metadata } from "next";
import { Cormorant_Garamond, Golos_Text } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { QueryProvider } from "@/providers/QueryProvider";
import { YandexMetrika } from "@/components/analytics/YandexMetrika";
import { CONTACTS, telegramUrl } from "@/lib/contacts";
import { SITE } from "@/lib/site";
import "../globals.css";

const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const sans = Golos_Text({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const title = t("title");
  const description = t("description");

  return {
    title,
    description,
    // Без metadataBase относительные OG-ссылки, которые Next генерирует из
    // opengraph-image.tsx, не превратятся в абсолютные — а мессенджеры
    // принимают только абсолютные.
    metadataBase: new URL(SITE.url),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ...Object.fromEntries(routing.locales.map((l) => [l, `/${l}`])),
        // Посетителю, чей язык не совпал ни с одной версией, отдаём русскую:
        // это язык основной аудитории, а не просто дефолт роутинга.
        "x-default": `/${routing.defaultLocale}`,
      },
    },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: locale === "ru" ? "ru_RU" : "en_US",
      url: `/${locale}`,
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "meta" });
  // Organization без logo: своего логотипа-ассета в public/ пока нет, а
  // ссылка на несуществующий файл делает разметку хуже её отсутствия.
  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: `${SITE.url}/${locale}`,
    description: t("description"),
    ...(CONTACTS.email ? { email: CONTACTS.email } : {}),
    ...(telegramUrl() ? { sameAs: [telegramUrl()] } : {}),
  };

  return (
    <html
      lang={locale}
      className={`${serif.variable} ${sans.variable} h-full`}
    >
      <body className="min-h-full bg-background text-foreground antialiased">
        <NextIntlClientProvider>
          <QueryProvider>{children}</QueryProvider>
        </NextIntlClientProvider>
        <YandexMetrika />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
      </body>
    </html>
  );
}
