import type { CSSProperties } from "react";
import type { Locale } from "@/i18n/config";
import frame from "./plate.module.css";
import s from "./woodland.module.css";
import { cormorant } from "./fonts";

/* The app speaks both languages, so its cover does too. Copy and faction data are the app's own. */
const COPY = {
  es: {
    companion: "Un compañero para Root",
    headline: ["Que el bosque", "decida", "por ti"],
    start: "Iniciar Partida",
    ready: "Tu partida está lista",
    title: "El Bosque Espera",
    map: "Mapa",
    mapName: "Otoño",
    reach: "Reach Total",
    balanced: "✓ Combinación balanceada",
    reroll: "Re-tirar",
    save: "Guardar partida",
    militant: "Militante",
    insurgent: "Insurgente",
  },
  en: {
    companion: "A companion for Root",
    headline: ["Let the forest", "decide", "for you"],
    start: "Start Game",
    ready: "Your game is ready",
    title: "The Forest Awaits",
    map: "Map",
    mapName: "Fall",
    reach: "Total Reach",
    balanced: "✓ Balanced combination",
    reroll: "Re-roll",
    save: "Save game",
    militant: "Militant",
    insurgent: "Insurgent",
  },
} satisfies Record<Locale, unknown>;

/** Three players, and 20 of Reach against the 18 the rules ask for. */
const FACTIONS = [
  { symbol: "♛", color: "#C0392B", reach: 10, militant: true, name: { es: "El Marquesado", en: "Marquise de Cat" }, animal: { es: "Gato", en: "Cat" } },
  { symbol: "✦", color: "#2980B9", reach: 7, militant: true, name: { es: "El Nido de Águilas", en: "Eyrie Dynasties" }, animal: { es: "Aves", en: "Birds" } },
  { symbol: "✿", color: "#27AE60", reach: 3, militant: false, name: { es: "La Alianza", en: "Woodland Alliance" }, animal: { es: "Ratones, conejos y zorros", en: "Mice, Rabbits & Foxes" } },
] as const;

/** Woodland Setup: the promise, a balanced three-player game with its Reach, and the dice that roll the next one. */
export function Woodland({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  return (
    <div className={s.root}>
      <div className={`${frame.frag} ${s.result}`}>
        <span className={s.eyebrow}>{t.ready}</span>
        <span className={`${s.title} ${cormorant.className}`}>{t.title}</span>
        <span className={s.map}>
          {t.map}: <b>{t.mapName}</b>
        </span>
        <span className={s.meter}>
          <span className={s.meterHead}>
            <span className={s.eyebrow}>{t.reach}</span>
            <span className={`${s.total} ${cormorant.className}`}>
              20 <span>/ 18</span>
            </span>
          </span>
          <span className={s.track}>
            <i className={s.threshold} />
            <i className={s.level} />
          </span>
          <span className={s.balanced}>{t.balanced}</span>
        </span>
        <span className={s.factions}>
          {FACTIONS.map((faction) => (
            <span key={faction.symbol} className={s.faction} style={{ "--faction": faction.color } as CSSProperties}>
              <span className={s.factionText}>
                <span className={`${s.factionName} ${cormorant.className}`}>
                  <span className={s.symbol}>{faction.symbol}</span>
                  {faction.name[locale]}
                </span>
                <span className={s.factionKind}>
                  {faction.animal[locale]} · {faction.militant ? t.militant : t.insurgent}
                </span>
              </span>
              <span className={`${s.reach} ${cormorant.className}`}>
                {faction.reach}
                <small>Reach</small>
              </span>
            </span>
          ))}
        </span>
      </div>

      <div className={`${frame.frag} ${s.promise}`}>
        <span className={s.ornaments}>♛ ✦ ✿ ✜ ≈ ☥ ⛏</span>
        <span className={s.eyebrow}>{t.companion}</span>
        <span className={`${s.headline} ${cormorant.className}`}>
          {t.headline[0]}
          <br />
          <em>{t.headline[1]}</em> {t.headline[2]}
        </span>
        <span className={s.start}>{t.start}</span>
      </div>

      <div className={`${frame.frag} ${s.actions}`}>
        <span className={s.reroll}>
          <span className={s.die}>🎲</span> {t.reroll}
        </span>
        <span className={s.save}>{t.save}</span>
      </div>
    </div>
  );
}
