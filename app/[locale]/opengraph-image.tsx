import { ImageResponse } from "next/og";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

// Без своего generateStaticParams маршрут картинки остаётся динамическим и
// перерисовывается на каждый запрос краулера. Локалей всего две — дешевле
// отрендерить обе на сборке.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Статичный, потому что конвенция Next не даёт локализовать alt: он
// экспортируется как константа на маршрут, а не считается на запрос.
export const alt = "LORE — physical product studio for creators";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Шрифт не подключаем: встроенный в ImageResponse Geist покрывает и латиницу,
// и кириллицу, а тянуть свой файл ради вордмарка — лишний вес в сборке.
export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "meta" });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0d0b0a",
          color: "#f3ede6",
          padding: "0 96px",
        }}
      >
        <div style={{ fontSize: 172, letterSpacing: 24, lineHeight: 1 }}>
          LORE
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: 40,
            lineHeight: 1.3,
            color: "#9a8f87",
            maxWidth: 900,
          }}
        >
          {t("ogTagline")}
        </div>
      </div>
    ),
    size,
  );
}
