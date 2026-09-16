import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { capabilities, education, experience, facts, numbers, process } from "@/content/profile";
import { PageHeader, SectionTitle } from "@/components/ui/PageHeader";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const t = getDictionary(locale);
  return { title: t.about.title, description: t.about.intro, alternates: { canonical: `/${locale}/about` } };
}

function formatRange(from: string, to: string | null, locale: string, present: string) {
  const fmt = new Intl.DateTimeFormat(locale, { month: "short", year: "numeric" });
  const start = fmt.format(new Date(`${from}-01T12:00:00`));
  const end = to ? fmt.format(new Date(`${to}-01T12:00:00`)) : present;
  return `${start} – ${end}`;
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <article>
      <PageHeader title={t.about.title}>
        <p className="mt-8 max-w-2xl font-display text-2xl leading-snug text-bg/90 md:text-3xl">{t.about.intro}</p>
      </PageHeader>

      {/* Facts, scattered uppercase lines like huyml's "plant daddy" wall */}
      <section className="px-4 py-20 md:px-6 md:py-28">
        <SectionTitle>{t.about.facts}</SectionTitle>
        <ul className="display flex flex-wrap gap-x-[4vw] gap-y-3 text-[clamp(1.5rem,3.6vw,3.5rem)]">
          {facts[locale]
            .filter((f) => !f.startsWith("TODO"))
            .map((f, i) => (
              <li key={f} className={i % 3 === 1 ? "text-muted" : i % 3 === 2 ? "text-accent" : ""}>
                {f}
              </li>
            ))}
        </ul>
      </section>

      {/* Numbers instead of awards */}
      <section className="border-t hairline px-4 py-20 md:px-6 md:py-28">
        <SectionTitle>{t.about.numbersTitle}</SectionTitle>
        <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {numbers.map((n) => (
            <li key={n.label[locale]}>
              <p className="display text-6xl md:text-7xl">{n.value}</p>
              <p className="label mt-3 max-w-[22ch] text-muted">{n.label[locale]}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Capabilities */}
      <section className="border-t hairline px-4 py-20 md:px-6 md:py-28">
        <SectionTitle>{t.about.capabilities}</SectionTitle>
        <div className="grid gap-10 md:grid-cols-5">
          {capabilities[locale].map((c) => (
            <div key={c.title}>
              <h3 className="display text-3xl">{c.title}</h3>
              <ul className="label mt-4 space-y-1 text-muted">
                {c.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Process, P1..P6 */}
      <section className="border-t hairline px-4 py-20 md:px-6 md:py-28">
        <SectionTitle>{t.about.process}</SectionTitle>
        <ol className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {process[locale].map((p) => (
            <li key={p.step} className="grid grid-cols-[3rem_1fr] gap-4">
              <span className="font-display text-2xl text-accent">{p.step}.</span>
              <div>
                <h3 className="display text-3xl">{p.title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">{p.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Experience */}
      <section className="border-t hairline px-4 py-20 md:px-6 md:py-28">
        <SectionTitle>{t.about.experience}</SectionTitle>
        <ol>
          {experience.map((r) => (
            <li key={r.company + r.from} className="grid gap-2 border-t hairline py-5 md:grid-cols-12 md:items-baseline">
              <p className="display text-3xl md:col-span-4">{r.company}</p>
              <p className="text-sm md:col-span-4">{r.title[locale]}</p>
              <p className="label text-muted md:col-span-2">{r.place}</p>
              <p className="label text-muted md:col-span-2 md:text-right">{formatRange(r.from, r.to, locale, t.about.present)}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Education */}
      <section className="border-t hairline px-4 py-20 md:px-6 md:py-28">
        <SectionTitle>{t.about.education}</SectionTitle>
        <ul className="max-w-2xl space-y-3 text-sm leading-relaxed">
          {education[locale].map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </section>
    </article>
  );
}
