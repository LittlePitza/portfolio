import type { Metadata } from "next";
import { site } from "@/content/site";
import { defaultLocale, locales, type Locale } from "@/i18n/config";

const socialLocales: Record<Locale, string> = { en: "en_US", es: "es_MX" };

/** Nested metadata is replaced by Next.js, so each route supplies a complete set. */
export function localizedPageMetadata({ locale, path, title, description }: {
  locale: Locale;
  path: `/${string}`;
  title: string;
  description: string;
}): Metadata {
  const url = `${site.url}/${locale}${path}`;
  const socialTitle = `${title} — ${site.name}`;
  const image = { url: `${site.url}/${locale}/opengraph-image`, width: 1200, height: 630, alt: site.name };

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(locales.map((language) => [language, `${site.url}/${language}${path}`])),
        "x-default": `${site.url}/${defaultLocale}${path}`,
      },
    },
    openGraph: {
      type: "website",
      title: socialTitle,
      description,
      url,
      siteName: site.name,
      locale: socialLocales[locale],
      alternateLocale: locales.filter((language) => language !== locale).map((language) => socialLocales[language]),
      images: [image],
    },
    twitter: { card: "summary_large_image", title: socialTitle, description, images: [image] },
  };
}
