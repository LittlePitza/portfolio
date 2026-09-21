import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { capabilities, education, experience, facts, languages, process } from "@/content/profile";
import { headItems } from "@/content/head";
import { SectionTitle } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
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
          <a href="#expertise">02 — {es ? "Experiencia y herramientas" : "Experience & tools"} <span aria-hidden>↘</span></a>
          <a href="#experience">03 — {es ? "La trayectoria" : "The journey"} <span aria-hidden>↘</span></a>
        </nav>
      </header>

      <section id="person" className={styles.person} aria-label={t.about.headQuestion}>
        <InsideHead items={headItems.map((h) => ({ icon: h.icon, title: h.title[locale], story: h.story[locale], signature: h.signature[locale] }))}
          question={t.about.headQuestion} hint={t.about.headHint} hintOpen={t.about.headHintOpen}
          openLabel={t.about.headOpen} close={t.about.close}
          left={{ value: "Web", label: t.about.headLeft }} right={{ value: es ? "TI" : "IT", label: t.about.headRight }} />
        <div className={styles.facts}>
          <p className="label text-muted">{es ? "Fuera del organigrama" : "Beyond the job title"}</p>
          <Reveal as="ul" stagger className={styles.factList}>
            {facts[locale].map((fact) => <li key={fact}>{fact}</li>)}
          </Reveal>
        </div>
      </section>

      <section id="expertise" className={`${styles.section} ${styles.expertise}`} aria-labelledby="expertise-title">
        <div className={styles.expertiseHeading}>
          <div>
            <p className="label text-muted">02 / {es ? "Perfil profesional" : "Professional background"}</p>
            <h2 id="expertise-title">{t.about.capabilities}</h2>
          </div>
          <p>{t.about.intro}</p>
        </div>
        <div className={styles.capabilities}>
          {capabilities.map((capability, index) => <details key={capability.id} className={styles.capability} open={index === 0}>
            <summary><span className="label text-muted">0{index + 1}</span><h3>{capability.title[locale]}</h3><span className={styles.expand} aria-hidden>+</span></summary>
            <div className={styles.capabilityContent}>
              <p>{capability.description[locale]}</p>
              <dl>{capability.groups.map((group) => <div key={group.label.en} className={styles.skillGroup}>
                <dt>{group.label[locale]}</dt>
                <dd><ul>{group.items[locale].map((item) => <li key={item}>{item}</li>)}</ul></dd>
              </div>)}</dl>
            </div>
          </details>)}
        </div>
        <div className={styles.education}>
          <div>
            <h3>{t.about.education}</h3>
            <p>{es ? "Formación académica y aprendizaje continuo." : "Academic background and continued learning."}</p>
          </div>
          <div>
            <ul>{education.map((item) => <li key={item.title.en}>
              <div><h4>{item.title[locale]}</h4><p>{item.institution}</p></div>
              <span className={styles.educationStatus}>{item.status[locale]}</span>
            </li>)}</ul>
            <p className={styles.languages}>
              <span className="label text-muted">{es ? "Idiomas" : "Languages"}</span>
              {languages[locale]}
            </p>
          </div>
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
            <div className={styles.roleHead}>
              <h3>{role.company}</h3>
              <p className={styles.roleTitle}>{role.title[locale]}</p>
              <p className={`label text-muted ${styles.rolePlace}`}>{role.place[locale]}</p>
              <p className={`label ${styles.date}`}>{formatRange(role.from, role.to, locale, t.about.present)}</p>
            </div>
            <div className={styles.roleBody}>
              <p className={styles.roleSummary}>{role.summary[locale]}</p>
              {role.responsibilities && <div className={styles.roleGroup}>
                <p className="label text-muted">{es ? "Responsabilidades" : "Responsibilities"}</p>
                <ul>{role.responsibilities[locale].map((item) => <li key={item}>{item}</li>)}</ul>
              </div>}
              {role.achievements && <div className={`${styles.roleGroup} ${styles.wins}`}>
                <p className="label text-muted">{es ? "Logros" : "Achievements"}</p>
                <ul>{role.achievements[locale].map((item) => <li key={item}>{item}</li>)}</ul>
              </div>}
            </div>
          </li>)}
        </Reveal>
      </section>
    </article>
  );
}
