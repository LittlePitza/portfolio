import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { capabilities, education, experience, facts, numbers, process } from "@/content/profile";
import { headItems } from "@/content/head";
import { PageHeader, SectionTitle } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { InsideHead } from "@/components/about/InsideHead";

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
      <PageHeader title={t.about.title} kicker={t.hero.eyebrow}>
        <p className="mt-8 max-w-2xl font-display text-2xl leading-snug text-bg/90 md:text-3xl">{t.about.intro}</p>
      </PageHeader>

      {/* Inside the head */}
      <section className="grid-paper border-b-2 border-ink" aria-label={t.about.headQuestion}>
        <InsideHead
          items={headItems.map((h) => ({ icon: h.icon, title: h.title[locale], story: h.story[locale], signature: h.signature[locale] }))}
          question={t.about.headQuestion}
          hint={t.about.headHint}
          hintOpen={t.about.headHintOpen}
          openLabel={t.about.headOpen}
          close={t.about.close}
          left={{ value: "05", label: t.about.headLeft }}
          right={{ value: "36", label: t.about.headRight }}
        />
      </section>

      {/* Facts, scattered uppercase lines */}
      <section className="px-4 py-20 md:px-6 md:py-28">
        <SectionTitle>{t.about.facts}</SectionTitle>
        <Reveal as="ul" stagger className="display flex flex-wrap gap-x-[4vw] gap-y-3 text-[clamp(1.5rem,3.6vw,3.5rem)]">
          {facts[locale]
            .filter((f) => !f.startsWith("TODO"))
            .map((f, i) => (
              <li key={f} className={i % 3 === 1 ? "text-muted" : i % 3 === 2 ? "text-accent" : ""}>
                {f}
              </li>
            ))}
        </Reveal>
      </section>

      {/* Numbers instead of awards */}
      <section className="border-t-2 border-ink bg-ink px-4 py-20 text-bg md:px-6 md:py-28">
        <SectionTitle>{t.about.numbersTitle}</SectionTitle>
        <Reveal as="ul" stagger className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {numbers.map((n) => (
            <li key={n.label[locale]} className="border-t-2 border-bg/30 pt-4">
              <CountUp value={n.value} className="display block text-6xl text-accent md:text-7xl" />
              <p className="label mt-3 max-w-[22ch] text-bg/60">{n.label[locale]}</p>
            </li>
          ))}
        </Reveal>
      </section>

      {/* Capabilities as cards */}
      <section className="grid-paper border-t-2 border-ink px-4 py-20 md:px-6 md:py-28">
        <SectionTitle>{t.about.capabilities}</SectionTitle>
        <Reveal stagger className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
          {capabilities[locale].map((c, i) => (
            <div key={c.title} className={`brutal p-6 ${i % 2 === 0 ? "bg-paper" : "bg-accent"}`}>
              <h3 className="display text-3xl">{c.title}</h3>
              <ul className="label mt-4 space-y-1 text-ink/70">
                {c.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Process, P1..P6 */}
      <section className="border-t-2 border-ink px-4 py-20 md:px-6 md:py-28">
        <SectionTitle>{t.about.process}</SectionTitle>
        <Reveal as="ol" stagger className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {process[locale].map((p) => (
            <li key={p.step} className="grid grid-cols-[4.5rem_1fr] gap-4 border-t-2 border-ink pt-4">
              <span className="display outline text-5xl">{p.step}</span>
              <div>
                <h3 className="display text-3xl">{p.title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">{p.text}</p>
              </div>
            </li>
          ))}
        </Reveal>
      </section>

      {/* Experience */}
      <section className="border-t-2 border-ink px-4 py-20 md:px-6 md:py-28">
        <SectionTitle>{t.about.experience}</SectionTitle>
        <Reveal as="ol" stagger>
          {experience.map((r) => (
            <li key={r.company + r.from} className="group grid gap-2 border-t-2 border-ink py-5 transition-colors hover:bg-paper md:grid-cols-12 md:items-baseline">
              <p className="display text-3xl transition-transform group-hover:translate-x-2 md:col-span-4">{r.company}</p>
              <p className="text-sm md:col-span-4">{r.title[locale]}</p>
              <p className="label text-muted md:col-span-2">{r.place}</p>
              <p className="label text-muted md:col-span-2 md:text-right">{formatRange(r.from, r.to, locale, t.about.present)}</p>
            </li>
          ))}
        </Reveal>
      </section>

      {/* Education */}
      <section className="border-t-2 border-ink px-4 py-20 md:px-6 md:py-28">
        <SectionTitle>{t.about.education}</SectionTitle>
        <Reveal as="ul" stagger className="max-w-2xl space-y-3 text-sm leading-relaxed">
          {education[locale].map((e) => (
            <li key={e} className="flex gap-3">
              <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 bg-accent" />
              {e}
            </li>
          ))}
        </Reveal>
      </section>
    </article>
  );
}
