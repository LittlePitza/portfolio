import Image from "next/image";
import type { CSSProperties } from "react";
import type { Slide } from "./types";
import styles from "./work.module.css";

interface Props {
  slide: Slide;
  index: number;
  sizes?: string;
  className?: string;
  priority?: boolean;
  brutal?: boolean;
  stamp?: boolean;
}

/** Real screenshots and editorial covers, with a vector fallback. */
export function Cover({ slide, index, sizes = "55vw", className = "", priority, brutal = true, stamp = false }: Props) {
  const label = String(index + 1).padStart(2, "0");
  const frame = brutal ? styles.coverFrame : "";

  if (slide.cover) {
    return (
      <div className={`${styles.cover} ${styles.imageCover} ${frame} ${className}`}>
        <Image src={slide.cover} alt={slide.coverAlt ?? slide.name} fill sizes={sizes} priority={priority} className="object-contain" />
        {stamp && <span className={styles.coverStamp}>{slide.status}</span>}
      </div>
    );
  }

  return (
    <div
      className={`${styles.cover} ${styles[slide.slug.replaceAll("-", "_")] ?? ""} ${frame} ${className}`}
      style={{ "--project-color": slide.color } as CSSProperties}
      aria-hidden="true"
    >
      <div className={styles.coverTop}><span>{slide.slug}</span><span>FIG. {label}</span></div>
      <div className={styles.illustration}><ProjectArtwork slug={slide.slug} /></div>
      <div className={styles.coverBottom}><span>{slide.stack[0]}</span><span>{slide.launch}</span></div>
      {stamp && <span className={styles.coverStamp}>{slide.status}</span>}
    </div>
  );
}

function ProjectArtwork({ slug }: { slug: string }) {
  switch (slug) {
    case "ti-hub":
      return (
        <svg viewBox="0 0 600 400" fill="none">
          <g stroke="currentColor" strokeWidth="1.5">
            <path d="M300 90V40M300 310v50M190 200H90m320 0h100M223 123l-67-67m221 67 67-67M223 277l-67 67m221-67 67 67" />
            <rect x="104" y="4" width="58" height="58" rx="4" transform="rotate(45 133 33)" />
            <rect x="438" y="4" width="58" height="58" rx="4" transform="rotate(45 467 33)" />
            <rect x="104" y="338" width="58" height="58" rx="4" transform="rotate(45 133 367)" />
            <rect x="438" y="338" width="58" height="58" rx="4" transform="rotate(45 467 367)" />
            <circle cx="300" cy="20" r="18" /><circle cx="300" cy="380" r="18" />
            <circle cx="70" cy="200" r="20" /><circle cx="530" cy="200" r="20" />
            <circle cx="300" cy="200" r="145" strokeDasharray="3 8" opacity=".4" />
          </g>
          <g className={styles.diagramCore}>
            <rect x="196" y="96" width="208" height="208" rx="10" fill="currentColor" />
            <path d="M253 200h94m-47-47v94" stroke="var(--cover-bg)" strokeWidth="28" />
            <rect x="182" y="82" width="236" height="236" rx="15" stroke="currentColor" />
          </g>
          <g fill="currentColor"><circle cx="190" cy="200" r="4" /><circle cx="410" cy="200" r="4" /><circle cx="300" cy="90" r="4" /><circle cx="300" cy="310" r="4" /></g>
        </svg>
      );
    case "attendance":
      return (
        <svg viewBox="0 0 600 400" fill="none">
          <g stroke="currentColor">
            <path d="M44 200h512M300 8v384" opacity=".2" />
            <circle cx="300" cy="200" r="176" opacity=".25" />
            <circle cx="300" cy="200" r="149" strokeWidth="1.5" />
            <circle cx="300" cy="200" r="118" strokeWidth="34" strokeDasharray="1 11.36" />
          </g>
          <g className={styles.clockHand}>
            <path d="M300 200V105" stroke="currentColor" strokeWidth="13" strokeLinecap="square" />
            <path d="m300 200 62 40" stroke="currentColor" strokeWidth="8" />
            <circle cx="300" cy="200" r="12" fill="currentColor" />
          </g>
          <g stroke="currentColor" strokeWidth="1.5">
            <path d="M74 110h76m300 180h76M74 100v20m452 160v20" />
            <rect x="66" y="243" width="52" height="34" rx="17" /><path d="m82 260 7 6 14-14" />
            <rect x="482" y="124" width="52" height="34" rx="17" /><path d="m498 141 7 6 14-14" />
          </g>
        </svg>
      );
    case "maintenance":
      return (
        <svg viewBox="0 0 600 400" fill="none">
          <g stroke="currentColor" strokeWidth="1.5" opacity=".35">
            <path d="m60 250 240-140 240 140-240 140L60 250Zm0-100 240-140 240 140-240 140L60 150Z" />
            <path d="M60 150v100m240 40v100m240-240v100M180 80v100m240-100v100M180 220v100m240-100v100" />
          </g>
          <g className={styles.diagramCore} stroke="currentColor" strokeWidth="2">
            <path d="m300 50 128 74-128 74-128-74 128-74Z" fill="var(--cover-bg)" />
            <path d="m172 124 128 74v148l-128-74V124Z" fill="currentColor" fillOpacity=".08" />
            <path d="m428 124-128 74v148l128-74V124Z" fill="currentColor" />
            <path d="m214 100 128 74m-85-99 128 74M214 149v148m43-123v148" />
            <path d="m342 174 0 148m43-173v148m-85-50 128-74m-128 123 128-74" stroke="var(--cover-bg)" strokeOpacity=".45" />
            <path d="m172 173 128 74m-128-25 128 74" />
          </g>
          <g fill="currentColor"><circle cx="60" cy="250" r="4" /><circle cx="540" cy="250" r="4" /><circle cx="300" cy="390" r="4" /><circle cx="300" cy="10" r="4" /></g>
        </svg>
      );
    case "marketplace":
      return (
        <svg viewBox="0 0 600 400" fill="none">
          <g stroke="currentColor" strokeWidth="1.5" opacity=".35"><path d="M50 350h500M50 50h500M90 25v350m420-350v350" /><circle cx="300" cy="200" r="165" strokeDasharray="3 7" /></g>
          <g className={styles.marketBlocks} stroke="currentColor" strokeWidth="2">
            <path d="m135 257 85-50 85 50-85 50-85-50Z" fill="var(--cover-bg)" /><path d="m135 257 85 50v62l-85-50v-62Z" /><path d="m305 257-85 50v62l85-50v-62Z" fill="currentColor" />
            <path d="m295 207 85-50 85 50-85 50-85-50Z" fill="var(--cover-bg)" /><path d="m295 207 85 50v62l-85-50v-62Z" /><path d="m465 207-85 50v62l85-50v-62Z" fill="currentColor" />
            <path d="m180 116 85-50 85 50-85 50-85-50Z" fill="var(--cover-bg)" /><path d="m180 116 85 50v62l-85-50v-62Z" /><path d="m350 116-85 50v62l85-50v-62Z" fill="currentColor" />
          </g>
          <path d="m385 70 34 20-34 20m-45-20h79M96 198l-34-20 34-20m45 20H62" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case "meetscribe":
      return (
        <svg viewBox="0 0 600 400" fill="none">
          <g stroke="currentColor" opacity=".2"><path d="M35 125h530M35 275h530M300 25v350" /><rect x="35" y="40" width="530" height="320" rx="4" /></g>
          {[0, 1].map((track) => (
            <g key={track} className={track === 0 ? styles.waveA : styles.waveB} stroke="currentColor" strokeWidth="5" strokeLinecap="round">
              {Array.from({ length: 43 }, (_, i) => {
                const height = 8 + Math.abs(Math.sin(i * .63 + track * 2) * Math.cos(i * .21 + track)) * 97;
                return <path key={i} d={`M${48 + i * 12} ${(125 + track * 150 - height / 2).toFixed(1)}v${height.toFixed(1)}`} />;
              })}
            </g>
          ))}
          <path d="M300 39v322" stroke="currentColor" strokeWidth="1.5" /><circle cx="300" cy="39" r="5" fill="currentColor" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 600 400" fill="none">
          <g stroke="currentColor" opacity=".28"><path d="M70 200h460M300 10v380" /><rect x="85" y="35" width="430" height="330" rx="165" /><rect x="112" y="62" width="376" height="276" rx="138" /></g>
          <g className={styles.diagramCore} stroke="currentColor" strokeWidth="2">
            <rect x="152" y="60" width="250" height="280" rx="14" fill="var(--cover-bg)" transform="rotate(-12 277 200)" />
            <rect x="202" y="60" width="250" height="280" rx="14" fill="var(--cover-bg)" transform="rotate(8 327 200)" />
            <rect x="195" y="67" width="210" height="266" rx="12" fill="currentColor" />
            <path d="M264 187v-30a36 36 0 0 1 72 0v30" stroke="var(--cover-bg)" strokeWidth="9" />
            <rect x="251" y="183" width="98" height="79" rx="7" stroke="var(--cover-bg)" strokeWidth="2" />
            <circle cx="300" cy="216" r="9" fill="var(--cover-bg)" /><path d="M300 223v14" stroke="var(--cover-bg)" strokeWidth="5" />
          </g>
        </svg>
      );
  }
}
