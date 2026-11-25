import { Head } from "@/components/about/Head";
import { CurtainLink } from "@/components/chrome/Curtain";
import styles from "./portraitPlate.module.css";

/** The plate's number, the same in both languages. */
const PLATE_INDEX = "LH — 01";

/** The wheel's six spokes, every 30 degrees around its centre. */
const SPOKE_ANGLES = [0, 30, 60, 90, 120, 150];

interface Props {
  /** About's path in the current locale. */
  href: string;
  /** "Detrás del código": the footer, and the link's accessible name. */
  label: string;
  /** "Sobre mí": the title the curtain shows on the way. */
  destination: string;
}

/**
 * The portrait plate on Home's cover (section 6.1): v1's tilted card, with Luis's
 * portrait from About and the orange wheel peeking from behind it, as a link to About
 * through the curtain. Presentational; its size comes from portraitPlate.module.css.
 */
export function PortraitPlate({ href, label, destination }: Props) {
  return (
    <div data-portrait-plate className={styles.plate}>
      <svg className={styles.wheel} viewBox="0 0 100 100" fill="none" aria-hidden>
        <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="0.6" />
        {SPOKE_ANGLES.map((angle) => (
          <path
            key={angle}
            d="M50 5V95"
            stroke="currentColor"
            strokeWidth="1.2"
            transform={`rotate(${angle} 50 50)`}
          />
        ))}
      </svg>
      <CurtainLink href={href} label={destination} aria-label={label} className={styles.card}>
        <span aria-hidden className={`${styles.mono} ${styles.index}`}>
          {PLATE_INDEX}
        </span>
        <Head className={styles.head} />
        <span className={styles.caption}>
          <span className={styles.mono}>{label}</span>
          <span aria-hidden>↗</span>
        </span>
      </CurtainLink>
    </div>
  );
}
