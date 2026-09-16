import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { site } from "@/content/site";
import { PageHeader } from "@/components/ui/PageHeader";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { Reveal } from "@/components/ui/Reveal";
import { localizedPageMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const t = getDictionary(locale);
  return localizedPageMetadata({
    locale,
    path: "/contact",
    title: t.contact.title,
    description: locale === "es"
      ? `Contacta a ${site.name}, desarrollador de software en Querétaro, México. Proyectos, colaboraciones, código y currículum.`
      : `Get in touch with ${site.name}, a software developer in Querétaro, Mexico. Projects, collaborations, code, and résumé.`,
  });
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const t = getDictionary(locale);

  const groups = [
    { title: t.contact.groups.code, links: [{ label: "GitHub", href: site.links.github }] },
    { title: t.contact.groups.career, links: [{ label: "LinkedIn", href: site.links.linkedin }] },
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
      <PageHeader title={t.contact.title} kicker={t.frame.city}>
        <div className="mt-10">
          <p className="label text-bg/60">{t.contact.lead}</p>
          <a href={`mailto:${site.email}`} className="link-draw mt-2 inline-block break-all font-display text-2xl text-bg md:text-5xl" data-cursor="Mail">
            {site.email}
          </a>
          <div className="mt-6">
            <CopyEmail email={site.email} copy={t.contact.copy} copied={t.contact.copied} />
          </div>
        </div>
      </PageHeader>

      <section className="grid-paper px-4 py-20 md:px-6 md:py-28">
        <Reveal stagger className="grid gap-6 md:grid-cols-3">
          {groups.map((g, i) => (
            <div key={g.title} className={`brutal p-6 md:p-8 ${i === 1 ? "bg-accent" : "bg-paper"}`}>
              <p className="label text-ink/60">{g.title}</p>
              <ul className="mt-6 space-y-2">
                {g.links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="link-draw display text-4xl" target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" data-cursor={t.work.open}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>
      </section>
    </article>
  );
}
