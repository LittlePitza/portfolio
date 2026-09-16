import type { Dictionary } from "@/i18n/get-dictionary";
import { site } from "@/content/site";

export function Footer({ t }: { t: Dictionary }) {
  return (
    <footer className="border-t hairline px-4 py-10 md:px-6">
      <div className="grid gap-6 md:grid-cols-12">
        <p className="label text-muted md:col-span-2">{t.footer.credits}</p>
        <p className="max-w-md text-sm leading-relaxed text-muted md:col-span-6">{t.footer.builtWith}</p>
        <div className="md:col-span-4 md:text-right">
          <a href={site.links.github} className="link-draw label" target="_blank" rel="noreferrer">
            {t.footer.source} ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
