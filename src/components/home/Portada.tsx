import { site } from "@/content/site";
import { enterStep } from "@/components/ui/enterStep";
import styles from "./carousel.module.css";

interface Props {
  eyebrow: string;
  tagline: string;
  sub: string;
  /** "Ver el trabajo ↓": a link to the list, which the carousel turns into a step to project 1. */
  cta: string;
}

/**
 * Home's position 0 (section 6.1): the eyebrow, the name in two display lines, and the
 * tagline with its paragraph and the way into the work. The name is the page's h1 and
 * never enters: it is already on screen when the opening curtain uncovers it.
 */
export function Portada({ eyebrow, tagline, sub, cta }: Props) {
  return (
    <section data-portada aria-labelledby="home-name" className={styles.portada}>
      <p data-enter style={enterStep(1)} className={`${styles.eyebrow} text-ui text-muted`}>
        {eyebrow}
      </p>
      <h1
        id="home-name"
        aria-label={site.name}
        className={`${styles.name} font-display text-display text-accent uppercase`}
      >
        {site.heroName.map((line, index) => (
          <span key={line} aria-hidden className={index === 0 ? styles.nameFirst : styles.nameLast}>
            {line}
          </span>
        ))}
      </h1>
      <div className={styles.intro}>
        <p data-enter style={enterStep(2)} className="font-display text-heading">
          {tagline}
        </p>
        <p data-enter style={enterStep(3)} className={`${styles.sub} text-body text-muted`}>
          {sub}
        </p>
        <p data-enter style={enterStep(4)}>
          <a href="#work" className={`${styles.cta} text-ui`}>
            {cta}
          </a>
        </p>
      </div>
    </section>
  );
}
