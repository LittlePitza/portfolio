import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { hasLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { site } from "@/content/site";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Frame } from "@/components/chrome/Frame";
import { Footer } from "@/components/chrome/Footer";
import { TabTitle } from "@/components/chrome/TabTitle";
import { Cursor } from "@/components/ui/Cursor";
import { PageTransition } from "@/components/chrome/PageTransition";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const instrument = Instrument_Serif({ variable: "--font-instrument", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });

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
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
    openGraph: { type: "website", locale, siteName: site.name, title: t.meta.title, description: t.meta.description, url: `/${locale}` },
    twitter: { card: "summary_large_image", title: t.meta.title, description: t.meta.description },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable} ${instrument.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <SmoothScroll>
          <PageTransition>
            <Frame locale={locale} t={t} />
            <main className="flex-1">{children}</main>
            <Footer locale={locale} t={t} />
          </PageTransition>
        </SmoothScroll>
        <Cursor />
        <TabTitle messages={t.tab} />
      </body>
    </html>
  );
}
