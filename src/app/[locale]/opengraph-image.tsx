import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { hasLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { site } from "@/content/site";

export const alt = "Luis Hernández. I build the systems I operate.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/** Social card: the name on the light stage, the mark on the black curtain. */
export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getDictionary(hasLocale(locale) ? locale : "en");
  const [serif, mono] = await Promise.all([
    readFile(join(process.cwd(), "src/assets/fonts/InstrumentSerif-Regular.ttf")),
    readFile(join(process.cwd(), "src/assets/fonts/GeistMono-Regular.ttf")),
  ]);

  const u = 300 / 64;
  const bar = (style: React.CSSProperties) => <div style={{ position: "absolute", background: "#141414", ...style }} />;

  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, display: "flex", background: "#ecece9", fontFamily: "Geist Mono", color: "#141414" }}>
        {/* Light stage */}
        <div style={{ width: 800, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "48px 56px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, letterSpacing: 2, textTransform: "uppercase", opacity: 0.6 }}>
            <span>{site.domain}</span>
            <span>{t.hero.eyebrow}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontFamily: "Instrument Serif", fontSize: 168, lineHeight: 0.84, color: "#ff4a1c", letterSpacing: -4 }}>
            <span>{site.heroName[0]}</span>
            <span>{site.heroName[1]}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <span style={{ fontFamily: "Instrument Serif", fontSize: 40 }}>{t.hero.tagline}</span>
            <span style={{ fontSize: 16, letterSpacing: 2, textTransform: "uppercase", opacity: 0.6 }}>Next.js · TypeScript · PostgreSQL · Querétaro, MX</span>
          </div>
        </div>
        {/* Black curtain with the mark */}
        <div style={{ width: 400, background: "#141414", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 300, height: 300, background: "#ff4a1c", position: "relative", display: "flex", boxShadow: "16px 16px 0 #ecece9" }}>
            {bar({ left: 9 * u, top: 11 * u, width: 9 * u, height: 42 * u })}
            {bar({ left: 9 * u, top: 44 * u, width: 21 * u, height: 9 * u })}
            {bar({ left: 34 * u, top: 11 * u, width: 9 * u, height: 42 * u })}
            {bar({ left: 49 * u, top: 11 * u, width: 9 * u, height: 42 * u })}
            {bar({ left: 34 * u, top: 28 * u, width: 24 * u, height: 8 * u })}
            {bar({ left: 60 * u, top: 0, width: 4 * u, height: 300 })}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Instrument Serif", data: serif, style: "normal", weight: 400 },
        { name: "Geist Mono", data: mono, style: "normal", weight: 400 },
      ],
    },
  );
}
