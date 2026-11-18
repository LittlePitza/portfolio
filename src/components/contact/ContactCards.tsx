import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { site } from "@/content/site";
import { BuildStamp } from "@/components/chrome/BuildStamp";
import { Character } from "@/components/preloader/Character";
import { ParallaxStack } from "./ParallaxStack";
import styles from "./cards.module.css";

interface Props {
  locale: Locale;
  t: Dictionary;
  /** Where the page places the region, e.g. its columns and rows on the stage. */
  className?: string;
}

/** The last segment of a profile URL: the handle the card shows as its action. */
function handleOf(url: string) {
  return new URL(url).pathname.split("/").filter(Boolean).pop() ?? url;
}

interface CardProps {
  label: string;
  /** The serif name; the credits card has none and reads as text. */
  name?: string;
  /** Makes the whole card the link. */
  href?: string;
  children: ReactNode;
  className?: string;
}

function Card({ label, name, href, children, className = "" }: CardProps) {
  const inside = (
    <>
      <span className="text-ui text-muted">{label}</span>
      {name && <span className={styles.name}>{name}</span>}
      {children}
    </>
  );
  const classes = `${styles.card} ${className}`;
  if (!href) return <div className={classes}>{inside}</div>;
  return (
    <a href={href} target="_blank" rel="noreferrer" className={classes}>
      {inside}
    </a>
  );
}

/**
 * The four cards of Contact (section 6.3), laid on a table: GitHub, LinkedIn, the résumé
 * in both languages and the credits with the build stamp. On the stage they overlap and
 * tilt, straighten when pointed at or focused, and scale down together on a short
 * window; stacked they run full width. Three are links; the credits are text.
 */
export function ContactCards({ locale, t, className = "" }: Props) {
  const action = "mt-auto text-ui";

  return (
    <div className={`${styles.region} ${className}`}>
      <ParallaxStack>
        <Card label={t.contact.cards.github} name="GitHub" href={site.links.github}>
          <span className={action}>{handleOf(site.links.github)} ↗</span>
        </Card>
        <Card label={t.contact.cards.linkedin} name="LinkedIn" href={site.links.linkedin}>
          <span className={action}>{handleOf(site.links.linkedin)} ↗</span>
        </Card>
        <Card label={t.contact.cards.cv} name="CV">
          <span className={`${action} flex gap-6`}>
            <a href={site.cv.es} download aria-label={t.contact.cvSpanish} className={styles.download}>
              ES ↓
            </a>
            <a href={site.cv.en} download aria-label={t.contact.cvEnglish} className={styles.download}>
              EN ↓
            </a>
          </span>
        </Card>
        <Card label={t.contact.cards.credits} className={styles.credits}>
          <span className={`${styles.credit} text-ui`}>{t.footer.builtWith}</span>
          <span className={`${action} ${styles.creditsAction}`}>
            <a href={site.links.source} target="_blank" rel="noreferrer" className={styles.download}>
              {t.footer.source} ↗
            </a>
            <br />
            <BuildStamp locale={locale} footer={t.footer} />
          </span>
          <Character className={styles.character} />
        </Card>
      </ParallaxStack>
    </div>
  );
}
