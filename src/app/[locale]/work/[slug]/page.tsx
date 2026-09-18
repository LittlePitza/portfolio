import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getProject, projects } from "@/content/projects";
import { Cover } from "@/components/work/Cover";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { TransitionLink } from "@/components/chrome/PageTransition";
import { localizedPageMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/work/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!hasLocale(locale) || !project) return {};
  return localizedPageMetadata({ locale, path: `/work/${slug}`, title: project.name, description: project.summary[locale] });
}

export default async function ProjectPage({ params }: PageProps<"/[locale]/work/[slug]">) {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) notFound();
  const index = projects.findIndex((p) => p.slug === slug);
  const project = projects[index];
  if (!project) notFound();
  const t = getDictionary(locale);
  const prev = projects[(index - 1 + projects.length) % projects.length]!;
  const next = projects[(index + 1) % projects.length]!;
  const num = String(index + 1).padStart(2, "0");

  const slide = {
    category: project.category[locale],
    role: project.role[locale],
    stack: project.stack,
    launch: project.launch[locale],
    status: project.status[locale],
    numbers: project.numbers.map((m) => ({ value: m.value, label: m.label[locale] })),
    summary: project.summary[locale],
  };

  return (
    <article>
      <header className="relative overflow-hidden bg-ink px-4 pb-12 pt-32 text-bg md:px-6 md:pb-16">
        <span aria-hidden className="display outline-bg pointer-events-none absolute -right-4 -top-6 text-[42vw] leading-none opacity-30 md:text-[28vw]">
          {num}
        </span>
        <div className="relative">
          <TransitionLink href={`/${locale}#work`} label={t.work.selected} className="btn mb-10 bg-ink text-bg shadow-[4px_4px_0_var(--accent)]">
            ← {t.work.back}
          </TransitionLink>
          <p className="label text-bg/60">
            {num}/{String(projects.length).padStart(2, "0")} · {slide.category}
          </p>
          <h1 className="display mt-4 text-[clamp(3rem,11vw,11rem)]">{project.name}</h1>
          <div className="mt-6 flex flex-wrap items-center gap-6">
            <p className="max-w-2xl font-display text-2xl leading-snug text-bg/90 md:text-3xl">{slide.summary}</p>
            <span className="stamp text-accent">{slide.status}</span>
          </div>
        </div>
      </header>

      <div className="px-4 pt-10 md:px-6">
        <Reveal>
          <div className="aspect-[16/9] w-full">
            <Cover project={project} index={index} locale={locale} />
          </div>
        </Reveal>
      </div>

      <section className="grid gap-10 px-4 py-16 md:grid-cols-12 md:px-6 md:py-24">
        <Reveal as="div" stagger className="space-y-6 md:col-span-4">
          <Meta label={t.work.role} lines={slide.role} />
          <Meta label={t.work.stack} lines={slide.stack} />
          <Meta label={t.work.launch} lines={[slide.launch]} />
          <Meta label={t.work.status} lines={[slide.status]} />
          {project.links && <Meta label={t.work.links} lines={project.links.map((l) => l.label)} hrefs={project.links.map((l) => l.href)} />}
        </Reveal>

        <div className="md:col-span-8">
          <Reveal as="ul" stagger className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {slide.numbers.map((m) => (
              <li key={m.label} className="brutal bg-paper p-5">
                <CountUp value={m.value} className="display block text-5xl md:text-6xl" />
                <p className="label mt-2 text-muted">{m.label}</p>
              </li>
            ))}
          </Reveal>
          <Reveal className="mt-14">
            <h2 className="label text-muted">{t.work.about}</h2>
            <div className="mt-6 max-w-2xl space-y-5 text-base leading-relaxed">
              {project.body[locale].map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <nav className="grid border-t-2 border-ink md:grid-cols-2" aria-label="Project navigation">
        <TransitionLink href={`/${locale}/work/${prev.slug}`} label={prev.name} className="group border-b-2 border-ink px-4 py-10 transition-colors hover:bg-ink hover:text-bg md:border-b-0 md:border-r-2 md:px-6" data-cursor={t.work.prev}>
          <p className="label opacity-60">← {t.work.prev}</p>
          <p className="display mt-2 text-4xl transition-transform group-hover:-translate-x-2 md:text-5xl">{prev.name}</p>
        </TransitionLink>
        <TransitionLink href={`/${locale}/work/${next.slug}`} label={next.name} className="group px-4 py-10 text-right transition-colors hover:bg-accent md:px-6" data-cursor={t.work.next}>
          <p className="label opacity-60">{t.work.next} →</p>
          <p className="display mt-2 text-4xl transition-transform group-hover:translate-x-2 md:text-5xl">{next.name}</p>
        </TransitionLink>
      </nav>
    </article>
  );
}

function Meta({ label, lines, hrefs }: { label: string; lines: string[]; hrefs?: string[] }) {
  return (
    <div className="grid grid-cols-[6rem_1fr] gap-3 border-t-2 border-ink pt-2">
      <dt className="label text-muted">{label}</dt>
      <dd className="label space-y-0.5">
        {lines.map((line, i) =>
          hrefs?.[i] ? (
            <a key={line} href={hrefs[i]} className="link-draw block" target="_blank" rel="noreferrer">
              {line} ↗
            </a>
          ) : (
            <span key={line} className="block">
              {line}
            </span>
          ),
        )}
      </dd>
    </div>
  );
}
