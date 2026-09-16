import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { site } from "@/content/site";
import { PageHeader } from "@/components/ui/PageHeader";
import { CopyEmail } from "@/components/ui/CopyEmail";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const t = getDictionary(locale);
  return { title: t.contact.title, alternates: { canonical: `/${locale}/contact` } };
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const t = getDictionary(locale);

  const groups = [
    {
      title: t.contact.groups.code,
      links: [{ label: "GitHub", href: site.links.github }],
    },
    {
      title: t.contact.groups.career,
      links: [{ label: "LinkedIn", href: site.links.linkedin }],
    },
    {
      title: t.contact.groups.cv,
      links: [
        { label: "English PDF", href: site.cv.en },
        { label: "PDF en español", href: site.cv.es },
      ],
    },
  ];

  return (
    <article>
      <PageHeader title={t.contact.title}>
        <div className="mt-8">
          <p className="label text-bg/60">{t.contact.lead}</p>
          <a href={`mailto:${site.email}`} className="link-draw mt-2 inline-block font-display text-2xl text-bg md:text-4xl">
            {site.email}
          </a>
          <div className="mt-3 text-bg/70">
            <CopyEmail email={site.email} copy={t.contact.copy} copied={t.contact.copied} />
          </div>
        </div>
      </PageHeader>

      <section className="grid gap-12 px-4 py-20 md:grid-cols-3 md:px-6 md:py-28">
        {groups.map((g) => (
          <div key={g.title}>
            <p className="label text-muted">{g.title}</p>
            <ul className="mt-4 space-y-2">
              {g.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="link-draw display text-4xl" target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </article>
  );
}
