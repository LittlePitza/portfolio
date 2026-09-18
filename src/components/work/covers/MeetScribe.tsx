import frame from "./plate.module.css";
import s from "./meetscribe.module.css";

const LINES = [
  { t: "12:21", who: "Helena", text: "Buenos días, vamos a revisar el avance de facturación." },
  { t: "12:27", who: "Zira", text: "El módulo de validación ya quedó terminado." },
  { t: "12:34", who: "Yo", mic: true, text: "¿Y cómo vamos con la integración del banco?" },
  { t: "12:40", who: "Zira", text: "Seguimos bloqueados con las credenciales de pruebas." },
  { t: "12:43", who: "Helena", text: "¿Quién puede conseguirnos el acceso esta semana?" },
] as const;

/**
 * MeetScribe mid-meeting: both tracks live on their meters, the transcript
 * attributed before any model runs, and minutes written by a model on the
 * same machine. The last line is still a draft the decoder may revise.
 */
export function MeetScribe() {
  return (
    <div className={s.root}>
      <div className={`${frame.frag} ${s.app}`}>
        <span className={s.bar}>
          <span className={s.rec}>
            <i />
            Grabando
          </span>
          <span className={s.session}>Revisión de facturación</span>
          <span className={s.elapsed}>12:48</span>
          <span className={s.stop}>Detener</span>
        </span>
        <span className={s.meters}>
          <Meter name="Yo" db="−12 dB" track="mic" />
          <Meter name="Remoto" db="−18 dB" track="remote" />
        </span>
        <span className={s.panelHead}>
          Transcripción <span className={s.follow}>Seguir</span>
        </span>
        <span className={s.lines}>
          {LINES.map((line) => (
            <span key={line.t} className={`${s.line} ${"mic" in line ? s.mic : s.remote}`}>
              <span className={s.t}>{line.t}</span>
              <span>
                <b>{line.who}:</b> {line.text}
              </span>
            </span>
          ))}
          <span className={`${s.line} ${s.mic} ${s.draft}`}>
            <span className={s.t}>12:46</span>
            <span>
              <b>Yo:</b> <span className={s.draftText}>Lo escalo con el contacto comercial esta semana</span>
            </span>
          </span>
        </span>
      </div>

      <div className={`${frame.frag} ${s.speakers}`}>
        <span className={s.panelHead}>Participantes</span>
        <Speaker name="Yo" count={2} track="mic" />
        <Speaker name="Helena" count={2} track="remote" />
        <Speaker name="Zira" count={2} track="remote" talking />
      </div>

      <div className={`${frame.frag} ${s.minutes}`}>
        <span className={s.panelHead}>
          Acta de la reunión <span className={s.badge}>llama3.1:8b</span>
        </span>
        <span className={s.summary}>El módulo de validación quedó terminado; la integración con el banco sigue bloqueada por las credenciales de pruebas.</span>
        <span className={s.heading}>Compromisos</span>
        <span className={s.action}>
          <b>Yo:</b> Escalar el bloqueo de credenciales — <em>esta semana</em>
        </span>
        <span className={s.action}>
          <b>Zira:</b> Entregar el simulador y las pruebas — <em>el próximo martes</em>
        </span>
      </div>
    </div>
  );
}

function Meter({ name, db, track }: { name: string; db: string; track: "mic" | "remote" }) {
  return (
    <span className={s.meter}>
      <b>{name}</b>
      <span className={`${s.leds} ${s[track]}`} />
      <span className={s.db}>{db}</span>
    </span>
  );
}

function Speaker({ name, count, track, talking = false }: { name: string; count: number; track: "mic" | "remote"; talking?: boolean }) {
  return (
    <span className={s.speaker}>
      <span className={`${s.swatch} ${s[track]} ${talking ? s.talking : ""}`} />
      <span className={s.speakerName}>{name}</span>
      <span className={s.count}>{count}</span>
    </span>
  );
}
