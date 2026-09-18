import frame from "./plate.module.css";
import s from "./dnd.module.css";
import { jakarta } from "./fonts";

const VITALS = [
  { label: "Puntos de golpe", value: "32", of: "/32", tone: "hp" },
  { label: "Armadura", value: "11", tone: "armor" },
  { label: "Iniciativa", value: "+1" },
  { label: "CD salv.", value: "14", tone: "arcane" },
  { label: "Espacios", value: "4·3·2" },
] as const;

const SITUATIONS = [
  { kind: "Combate", text: "Tres o más enemigos juntos" },
  { kind: "Emergencia", text: "Me van a pegar ahora mismo" },
  { kind: "Precisión", text: "Hay que rematar sin fallar" },
  { kind: "Caos", text: "Quiero provocar una oleada" },
] as const;

/**
 * The D&D companion at the table with Soryn Vort, its example sorcerer: the
 * turn planner, Fireball with the slots it spends, and the session log. The
 * rules sit inside each action instead of in a book beside it.
 */
export function Dnd() {
  return (
    <div className={`${s.root} ${jakarta.className}`}>
      <div className={`${frame.frag} ${s.console}`}>
        <span className={s.header}>
          <span className={s.avatar}>S</span>
          <span>
            <span className={s.name}>Soryn Vort</span>
            <span className={s.meta}>Hechicero 5 · Magia Salvaje · Humano · Charlatán · Caótico Neutral</span>
          </span>
        </span>
        <span className={s.tabs}>
          <span className={s.tabOn}>Combate</span>
          <span>Ataques</span>
          <span>Conjuros</span>
          <span>Hoja</span>
          <span>Recuerdos</span>
        </span>
        <span className={s.vitals}>
          {VITALS.map((vital) => (
            <span key={vital.label} className={`${s.vital} ${"tone" in vital ? s[vital.tone] : ""}`}>
              <span className={s.vitalLabel}>{vital.label}</span>
              <span className={s.vitalValue}>
                {vital.value}
                {"of" in vital && <small>{vital.of}</small>}
              </span>
            </span>
          ))}
        </span>
        <span className={s.question}>¿Qué hago este turno?</span>
        <span className={s.hint}>Toca tu situación y te doy la secuencia exacta, ya comprobada contra las reglas de 2024.</span>
        <span className={s.situations}>
          {SITUATIONS.map((situation) => (
            <span key={situation.kind} className={s.situation}>
              <span className={s.kind}>{situation.kind}</span>
              {situation.text}
            </span>
          ))}
        </span>
      </div>

      <div className={`${frame.frag} ${s.spell}`}>
        <span className={s.spellLevel}>Nivel 3 · 1 acción</span>
        <span className={s.spellName}>Bola de Fuego</span>
        <span className={s.spellText}>8d6 fuego · CD 14 Destreza · esfera de 6 m</span>
        <span className={s.slots}>
          <span className={s.slotsLabel}>Nivel 3</span>
          <span className={s.pips}>
            <i />
            <i className={s.spent} />
          </span>
          <span className={s.slotCount}>
            <span>2/2</span>
            <span>1/2</span>
          </span>
        </span>
        <span className={s.cast}>Lanzar</span>
      </div>

      <div className={`${frame.frag} ${s.log}`}>
        <span className={s.logTitle}>Bitácora de la sesión</span>
        <Entry value="19" title="Ataque · Rayo de Fuego" detail="d20 13 + 6 · impacta" time="20:14" />
        <Entry value="13" title="Daño · Rayo de Fuego" detail="2d10 6 + 7 · fuego" time="20:14" />
      </div>
    </div>
  );
}

function Entry({ value, title, detail, time }: { value: string; title: string; detail: string; time: string }) {
  return (
    <span className={s.entry}>
      <span className={s.value}>{value}</span>
      <span className={s.entryBody}>
        <span className={s.entryTitle}>{title}</span>
        <span className={s.entryDetail}>{detail}</span>
      </span>
      <span className={s.time}>{time}</span>
    </span>
  );
}
