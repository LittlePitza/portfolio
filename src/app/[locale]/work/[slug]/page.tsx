import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getProject, projects } from "@/content/projects";
import { Cover } from "@/components/work/Cover";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/work/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!hasLocale(locale) || !project) return {};
  return { title: project.name, description: project.summary[locale], alternates: { canonical: `/${locale}/work/${slug}` } };
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

  const slide = {
    slug: project.slug,
    href: `/${locale}/work/${project.slug}`,
    name: project.name,
    category: project.category[locale],
    role: project.role[locale],
    stack: project.stack,
    launch: project.launch[locale],
    status: project.status[locale],
    numbers: project.numbers.map((m) => ({ value: m.value, label: m.label[locale] })),
    summary: project.summary[locale],
    color: project.color,
    cover: project.cover,
  };

  return (
    <article>
      <header className="bg-ink px-4 pb-12 pt-32 text-bg md:px-6">
        <p className="label text-bg/60">
          {String(index + 1).padStart(2, "0")}/{String(projects.length).padStart(2, "0")} · {slide.category}
        </p>
        <h1 className="display mt-4 text-[clamp(3rem,11vw,11rem)]">{project.name}</h1>
        <p className="mt-6 max-w-2xl font-display text-2xl leading-snug text-bg/90 md:text-3xl">{slide.summary}</p>
      </header>

      <div className="px-4 md:px-6">
        <Cover slide={slide} index={index} sizes="100vw" priority className="-mt-0 aspect-[16/9] w-full" />
      </div>

      <section className="grid gap-10 px-4 py-16 md:grid-cols-12 md:px-6 md:py-24">
        <dl className="space-y-6 md:col-span-4">
          <Meta label={t.work.role} lines={slide.role} />
          <Meta label={t.work.stack} lines={slide.stack} />
          <Meta label={t.work.launch} lines={[slide.launch]} />
          <Meta label={t.work.status} lines={[slide.status]} />
          {project.links && <Meta label={t.work.links} lines={project.links.map((l) => l.label)} hrefs={project.links.map((l) => l.href)} />}
        </dl>

        <div className="md:col-span-8">
          <ul className="grid grid-cols-2 gap-8 border-b hairline pb-10 md:grid-cols-4">
            {slide.numbers.map((m) => (
              <li key={m.label}>
                <p className="display text-5xl md:text-6xl">{m.value}</p>
                <p className="label mt-2 text-muted">{m.label}</p>
              </li>
            ))}
          </ul>
          <h2 className="label mt-10 text-muted">{t.work.about}</h2>
          <div className="mt-6 max-w-2xl space-y-5 text-base leading-relaxed">
            {project.body[locale].map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <nav className="grid border-t hairline md:grid-cols-2" aria-label="Project navigation">
        <Link href={`/${locale}/work/${prev.slug}`} className="group border-b hairline px-4 py-10 md:border-b-0 md:border-r md:px-6">
          <p className="label text-muted">← {t.work.prev}</p>
          <p className="display mt-2 text-4xl transition-colors group-hover:text-accent">{prev.name}</p>
        </Link>
        <Link href={`/${locale}/work/${next.slug}`} className="group px-4 py-10 text-right md:px-6">
          <p className="label text-muted">{t.work.next} →</p>
          <p className="display mt-2 text-4xl transition-colors group-hover:text-accent">{next.name}</p>
        </Link>
      </nav>
    </article>
  );
}

function Meta({ label, lines, hrefs }: { label: string; lines: string[]; hrefs?: string[] }) {
  return (
    <div className="grid grid-cols-[6rem_1fr] gap-3">
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
