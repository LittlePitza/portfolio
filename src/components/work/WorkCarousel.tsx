import { TransitionLink } from "@/components/chrome/PageTransition";
import { Cover } from "./Cover";
import type { Slide, WorkLabels } from "./types";
import styles from "./work.module.css";

interface Props {
  slides: Slide[];
  labels: WorkLabels;
}

/** One server-rendered catalogue. CSS enhances motion without hiding content. */
export function WorkCarousel({ slides, labels }: Props) {
  if (!slides.length) return null;

  return (
    <section className={styles.catalogue} aria-labelledby="selected-work-title">
      <header className={styles.sectionHeader}>
        <div className={styles.sectionEyebrow}>
          <span className="label">Portfolio / {slides[0].launch}</span>
          <span className="label" aria-hidden>01 — {String(slides.length).padStart(2, "0")}</span>
        </div>
        <h2 id="selected-work-title" className={styles.sectionTitle}>{labels.selected}<span aria-hidden>↙</span></h2>
      </header>

      <ol className={styles.projects}>
        {slides.map((slide, index) => (
          <li key={slide.slug} className={styles.project}>
            <article aria-labelledby={`project-${slide.slug}`}>
              <div className={styles.projectTopline}>
                <span className="label">{String(index + 1).padStart(2, "0")} / {slide.category}</span>
                <span className={styles.status}><span aria-hidden />{slide.status}</span>
              </div>
              <TransitionLink
                href={slide.href}
                label={slide.name}
                className={styles.projectLink}
                aria-label={`${slide.name} — ${labels.view}`}
                data-cursor={labels.open}
              >
                <div className={styles.artwork}>
                  <Cover slide={slide} index={index} sizes="(min-width: 900px) 55vw, 100vw" brutal={false} className={styles.projectCover} />
                  <span className={styles.artworkArrow} aria-hidden>↗</span>
                </div>
                <div className={styles.projectBody}>
                  <div>
                    <p className={styles.projectRole}>{slide.role.join(" / ")}</p>
                    <h3 id={`project-${slide.slug}`} className={styles.projectName}>{slide.name}</h3>
                    <p className={styles.summary}>{slide.summary}</p>
                  </div>
                  <dl className={styles.metrics} aria-label={labels.numbers}>
                    {slide.numbers.map((metric) => (
                      <div key={metric.label}>
                        <dt>{metric.label}</dt>
                        <dd>{metric.value}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className={styles.projectFooter}>
                    <ul className={styles.stack} aria-label={labels.stack}>
                      {slide.stack.map((technology) => <li key={technology}>{technology}</li>)}
                    </ul>
                    <span className={styles.openCase}>{labels.view}<span aria-hidden>↗</span></span>
                  </div>
                </div>
              </TransitionLink>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
