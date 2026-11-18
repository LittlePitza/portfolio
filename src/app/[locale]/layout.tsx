import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { hasLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { site } from "@/content/site";
import { TabTitle } from "@/components/chrome/TabTitle";
import { Curtain } from "@/components/chrome/Curtain";
import { UpdateWatcher } from "@/components/chrome/UpdateWatcher";
import { introScript } from "@/components/preloader/intro";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
// Only the covers and the v1 labels use it, so it is not worth a preload (section 3.2).
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], preload: false });
const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: "normal",
});

export const viewport: Viewport = {
  themeColor: "#ecece9",
  colorScheme: "light",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const t = getDictionary(locale);
  return {
    metadataBase: new URL(site.url),
    title: { default: t.meta.title, template: `%s — ${site.name}` },
    description: t.meta.description,
    applicationName: site.name,
    authors: [{ name: site.fullName, url: site.url }],
    creator: site.fullName,
    alternates: {
      canonical: `/${locale}`,
      languages: { ...Object.fromEntries(locales.map((l) => [l, `/${l}`])), "x-default": "/en" },
    },
    openGraph: { type: "website", locale: locale === "es" ? "es_MX" : "en_US", alternateLocale: [locale === "es" ? "en_US" : "es_MX"], siteName: site.name, title: t.meta.title, description: t.meta.description, url: `/${locale}` },
    twitter: { card: "summary_large_image", title: t.meta.title, description: t.meta.description },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    // The intro mark lands on <html> before React arrives, which hydration is right to notice and wrong to undo.
    <html lang={locale} suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${instrument.variable} h-full antialiased`}>
      <head>
        {/* Before the first paint, so the opening curtain is never a second act. */}
        <script dangerouslySetInnerHTML={{ __html: introScript(locales.map((l) => `/${l}`)) }} />
      </head>
      <body className="min-h-full">
        {/* The skip link has to sit above the bar it skips; no curtain is up while it has focus. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-(--margin) focus:left-(--margin)
            focus:z-(--z-curtain) focus:bg-ink focus:px-4 focus:py-3 focus:text-ui focus:text-bg"
        >
          {t.frame.skipToContent}
        </a>
        <Curtain domain={site.domain} loadingLabel={t.curtain.label}>
          {children}
        </Curtain>
        <TabTitle messages={t.tab} />
        <UpdateWatcher message={t.update.message} action={t.update.action} />
      </body>
    </html>
  );
}
