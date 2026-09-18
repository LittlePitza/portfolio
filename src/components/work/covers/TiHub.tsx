import frame from "./plate.module.css";
import s from "./tihub.module.css";
import { poppins } from "./fonts";
import { Icon, type IconName } from "./icons";

/** TI Hub: the portal anyone files from, the SLA the desk is measured against, and a ticket about to breach it. */
export function TiHub() {
  return (
    <div className={`${s.root} ${poppins.className}`}>
      <div className={`${frame.frag} ${s.portal}`}>
        <span className={s.back}>
          <Icon name="back" />
          Regresar
        </span>
        <span className={s.title}>Reportar un problema</span>
        <span className={s.desc}>Tres preguntas rápidas y el equipo de TI se encarga del resto.</span>
        <span className={s.step}>
          <span className={s.num}>1</span>¿Qué tipo de problema es?
        </span>
        <span className={s.options}>
          <Option icon="monitor" title="Mi equipo" text="Computadora, impresora, pantalla…" />
          <Option icon="app" title="Un programa" text="No abre, marca error o necesito instalarlo" on />
          <Option icon="wifi" title="Internet o red" text="Sin conexión, lenta o se corta" />
          <Option icon="key" title="Accesos" text="Contraseñas, permisos a carpetas o sistemas" />
        </span>
      </div>

      <div className={`${frame.frag} ${s.sla}`}>
        <span className={s.eyebrow}>Resolución promedio</span>
        <span className={s.value}>
          4<small>d</small>7<small>h</small>
        </span>
        <span className={s.bar}>
          <i />
        </span>
        <span className={s.slaFoot}>
          <span>
            <b>78%</b> dentro de SLA
          </span>
          <span>52 resueltos</span>
        </span>
      </div>

      <div className={`${frame.frag} ${s.ticket}`}>
        <span className={s.ticketTitle}>La impresora de etiquetas no imprime</span>
        <span className={s.ticketMeta}>
          <span className={s.folio}>TK-0142 · Almacén</span>
          <span className={s.due}>por vencer</span>
        </span>
        <span className={`${s.bar} ${s.consumed}`}>
          <i />
        </span>
        <span className={s.ticketFoot}>
          <span>80% del SLA consumido</span>
          <span className={s.folio}>quedan 1h 36m</span>
        </span>
      </div>
    </div>
  );
}

function Option({ icon, title, text, on = false }: { icon: IconName; title: string; text: string; on?: boolean }) {
  return (
    <span className={`${s.option} ${on ? s.optionOn : ""}`}>
      <span className={s.optionIcon}>
        <Icon name={icon} />
      </span>
      <span>
        <span className={s.optionTitle}>{title}</span>
        <span className={s.optionText}>{text}</span>
      </span>
    </span>
  );
}
