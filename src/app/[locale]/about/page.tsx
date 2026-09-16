import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { capabilities, education, experience, facts, numbers, process } from "@/content/profile";
import { headItems } from "@/content/head";
import { SectionTitle } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { InsideHead } from "@/components/about/InsideHead";
import { localizedPageMetadata } from "@/lib/metadata";
import styles from "@/components/about/about.module.css";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const t = getDictionary(locale);
  return localizedPageMetadata({ locale, path: "/about", title: t.about.title, description: t.about.intro });
}

function formatRange(from: string, to: string | null, locale: string, present: string) {
  const fmt = new Intl.DateTimeFormat(locale, { month: "short", year: "numeric", timeZone: "UTC" });
  return `${fmt.format(new Date(`${from}-01T12:00:00Z`))} — ${to ? fmt.format(new Date(`${to}-01T12:00:00Z`)) : present}`;
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const t = getDictionary(locale);
  const es = locale === "es";

  return (
    <article>
      <header className={styles.header}>
        <Reveal className={styles.headerTop}>
          <p className="label">{t.hero.eyebrow}</p>
          <span className="label text-muted">{es ? "La persona detrás del sistema" : "The person behind the system"}</span>
        </Reveal>
        <Reveal><h1 className={styles.title}>{t.about.title}<span aria-hidden className={styles.asterisk}>✳</span></h1></Reveal>
        <nav className={styles.index} aria-label={es ? "En esta página" : "On this page"}>
          <a href="#person">01 — {es ? "La persona" : "The person"} <span aria-hidden>↘</span></a>
          <a href="#approach">02 — {es ? "El método" : "The approach"} <span aria-hidden>↘</span></a>
          <a href="#experience">03 — {es ? "La trayectoria" : "The journey"} <span aria-hidden>↘</span></a>
        </nav>
      </header>

      <section id="person" className={styles.person} aria-label={t.about.headQuestion}>
        <InsideHead items={headItems.map((h) => ({ icon: h.icon, title: h.title[locale], story: h.story[locale], signature: h.signature[locale] }))}
          question={t.about.headQuestion} hint={t.about.headHint} hintOpen={t.about.headHintOpen}
          openLabel={t.about.headOpen} close={t.about.close}
          left={{ value: "05", label: t.about.headLeft }} right={{ value: "36", label: t.about.headRight }} />
        <div className={styles.facts}>
          <p className="label text-muted">{es ? "Fuera del organigrama" : "Beyond the job title"}</p>
          <Reveal as="ul" stagger className={styles.factList}>
            {facts[locale].filter((fact) => !fact.startsWith("TODO")).map((fact) => <li key={fact}>{fact}</li>)}
          </Reveal>
        </div>
      </section>

      <section id="approach" className={styles.manifesto}>
        <div className={styles.manifestoTop}>
          <p className="label text-bg/70">02 / {es ? "Mi forma de trabajar" : "My approach"}</p>
          <span className="label text-bg/70">{es ? "Del código a la operación" : "From code to operations"}</span>
        </div>
        <Reveal><h2 className={styles.statement}>{es ? "Construyo." : "I build."}<br /><span>{es ? "Opero." : "I operate."}</span><br />{es ? "Respondo." : "I own it."}</h2></Reveal>
        <Reveal><p className={styles.intro}>{t.about.intro}</p></Reveal>
        <div className={styles.metricsHeader}><SectionTitle>{t.about.numbersTitle}</SectionTitle></div>
        <Reveal as="ul" stagger className={styles.metrics}>
          {numbers.map((number) => <li key={number.label[locale]}>
            <CountUp value={number.value} className={styles.metricValue} />
            <p className="label text-bg/70">{number.label[locale]}</p>
          </li>)}
        </Reveal>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <SectionTitle>{t.about.capabilities}</SectionTitle>
          <p>{es ? "Pienso en el sistema completo." : "I think in whole systems."}</p>
        </div>
        <div className={styles.capabilities}>
          {capabilities[locale].map((capability, index) => <details key={capability.title} className={styles.capability} open={index === 0}>
            <summary><span className="label text-muted">0{index + 1}</span><h3>{capability.title}</h3><span className={styles.expand} aria-hidden>+</span></summary>
            <ul>{capability.items.map((item) => <li key={item}>{item}</li>)}</ul>
          </details>)}
        </div>
      </section>

      <section className={`${styles.section} ${styles.processSection}`}>
        <div className={styles.sectionHeading}>
          <SectionTitle>{t.about.process}</SectionTitle>
          <p>{es ? "Una idea. Seis pasos. Usuarios reales." : "One idea. Six steps. Real users."}</p>
        </div>
        <Reveal as="ol" stagger className={styles.process}>
          {process[locale].map((step) => <li key={step.step}>
            <div className={styles.stepTop}><span className="label">{step.step}</span><span aria-hidden>↗</span></div>
            <h3>{step.title}</h3><p>{step.text}</p>
          </li>)}
        </Reveal>
      </section>

      <section id="experience" className={styles.section}>
        <div className={styles.sectionHeading}>
          <SectionTitle>{t.about.experience}</SectionTitle>
          <p>{es ? "Aprender haciendo. Desde 2019." : "Learning by doing. Since 2019."}</p>
        </div>
        <Reveal as="ol" stagger className={styles.experience}>
          {experience.map((role, index) => <li key={role.company + role.from}>
            <span className="label text-muted">0{index + 1}</span>
            <h3>{role.company}</h3>
            <div><p>{role.title[locale]}</p><p className="label text-muted">{role.place}</p></div>
            <p className={`label ${styles.date}`}>{formatRange(role.from, role.to, locale, t.about.present)}</p>
          </li>)}
        </Reveal>
        <div className={styles.education}>
          <SectionTitle>{t.about.education}</SectionTitle>
          <ul>{education[locale].map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </section>
    </article>
  );
}
