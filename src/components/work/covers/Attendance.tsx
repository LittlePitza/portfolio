import type { CSSProperties } from "react";
import frame from "./plate.module.css";
import s from "./attendance.module.css";

/** A fortnight from Saturday 5 to Friday 18: weekends off, one late entry, today still running. */
const DAYS: ({ height: number; late?: boolean } | null)[] = [
  null, null,
  { height: 90 }, { height: 86 }, { height: 88, late: true }, { height: 92 }, { height: 80 },
  null, null,
  { height: 89 }, { height: 94 }, { height: 86 }, { height: 91 }, { height: 38 },
];

/**
 * Attendance: Ana's punch screen four hours into her day, her last fourteen
 * days, and the real reason the app needs no server: the database itself
 * refuses to delete a punch.
 */
export function Attendance() {
  return (
    <div className={s.root}>
      <div className={`${frame.frag} ${s.hero}`}>
        <span className={s.head}>
          <span>
            <span className={s.greeting}>Buenas tardes, Ana</span>
            <span className={s.date}>Viernes, 18 de septiembre</span>
          </span>
          <span className={s.clock}>
            <span className={s.time}>
              13:
              <span className={`${s.ticker} ${s.minutes}`} />:
              <span className={`${s.ticker} ${s.seconds}`} />
            </span>
            <span className={s.zone}>hora local</span>
          </span>
        </span>

        <span className={s.body}>
          <span className={s.ring}>
            <svg viewBox="0 0 100 100" aria-hidden>
              <circle className={s.track} cx="50" cy="50" r="42" />
              <circle className={s.fill} cx="50" cy="50" r="42" />
            </svg>
            <span className={s.ringInner}>
              <span className={s.ringValue}>4:00</span>
              <span className={s.ringOf}>de 9:00 h</span>
            </span>
          </span>
          <span className={s.state}>
            <span className={s.status}>
              <i />
              Trabajando
            </span>
            <span className={s.caption}>Tu tiempo está corriendo.</span>
            <span className={s.facts}>
              <Fact label="Entrada" value="09:02" />
              <Fact label="En pausa" value="0:00" />
              <Fact label="Salida" value="—" />
            </span>
          </span>
        </span>

        <span className={s.actions}>
          <span className={`${s.button} ${s.outline}`}>Iniciar pausa</span>
          <span className={`${s.button} ${s.solid}`}>Registrar salida</span>
        </span>
      </div>

      <div className={`${frame.frag} ${s.fortnight}`}>
        <span className={s.fortnightTitle}>Últimos 14 días</span>
        <span className={s.bars}>
          {DAYS.map((day, i) =>
            day ? (
              <span key={i}>
                <b className={day.late ? s.late : undefined} style={{ "--h": `${day.height}%`, "--i": i } as CSSProperties} />
                <em />
              </span>
            ) : (
              <span key={i} className={s.off} />
            ),
          )}
        </span>
        <span className={s.key}>
          <span>
            <i className={s.keyWorked} />
            Trabajado
          </span>
          <span>
            <i className={s.keyExpected} />
            Esperado
          </span>
          <span>
            <i className={s.keyLate} />
            Entrada tarde
          </span>
        </span>
      </div>

      <div className={`${frame.frag} ${s.sql}`}>
        <span>
          <span className={s.prompt}>postgres=&gt;</span> delete from attendance.punches;
        </span>
        <span>
          <span className={s.error}>ERROR:</span> attendance.punches es append-only:
        </span>
        <span className={s.prompt}>los marcajes no se borran</span>
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <span>
      <span className={s.factLabel}>{label}</span>
      <span className={s.factValue}>{value}</span>
    </span>
  );
}
