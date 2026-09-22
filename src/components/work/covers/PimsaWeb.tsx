import frame from "./plate.module.css";
import s from "./pimsaweb.module.css";
import { spaceGrotesk } from "./fonts";

interface Lead {
  initials: string;
  name: string;
  line: string;
  status: "new" | "contacted" | "closed";
}

/** The dashboard's latest leads. The first one only arrives while you look. */
const LEADS: Lead[] = [
  { initials: "AS", name: "Andrea Salinas", line: "Recolección de scrap · 22 sep 2026, 1:12 p.m.", status: "new" },
  { initials: "JT", name: "Jorge Treviño", line: "Polímeros de ingeniería · 21 sep 2026, 11:20 a.m.", status: "contacted" },
  { initials: "LM", name: "Laura Méndez", line: "Molienda y peletizado · 19 sep 2026, 9:47 a.m.", status: "closed" },
  { initials: "RC", name: "Raúl Castañeda", line: "Contenedores colapsables · 18 sep 2026, 4:05 p.m.", status: "closed" },
];

const LEAD_STATUS = { new: "Nuevo", contacted: "Contactado", closed: "Cerrado" } as const;

interface Send {
  date: string;
  kind: string;
  extra?: string;
  status: "sent" | "skipped" | "failed";
  ms?: number;
}

/** The delivery log: every attempt, including the ones that never left. The first row is the lead above being emailed. */
const SENDS: Send[] = [
  { date: "22 sep 2026, 1:12 p.m.", kind: "Lead", status: "sent", ms: 412 },
  { date: "21 sep 2026, 5:40 p.m.", kind: "Postulación", extra: "Acuse", status: "skipped" },
  { date: "21 sep 2026, 5:40 p.m.", kind: "Postulación", status: "sent", ms: 596 },
  { date: "19 sep 2026, 10:03 a.m.", kind: "Lead", extra: "Prueba", status: "failed" },
];

const SEND_STATUS = { sent: "Enviado", skipped: "No enviado", failed: "Falló" } as const;

/**
 * PIMSA Web: the public site's hero, and behind it the panel where a quote
 * request lands as a lead, and the delivery log that records every email the
 * site tries to send. The lead is stored before anything is sent, so on hover
 * it arrives first and its email follows.
 */
export function PimsaWeb() {
  return (
    <div className={s.root}>
      <div className={`${frame.frag} ${s.site}`}>
        <span className={s.nav}>
          <Logo />
          <span className={s.links}>
            <span>Inicio</span>
            <span>Nosotros</span>
            <span>Servicios</span>
            <span>Stock</span>
            <span>Bolsa de trabajo</span>
          </span>
          <span className={s.quote}>Cotizar</span>
        </span>
        <span className={s.hero}>
          <span className={s.eyebrow}>Cobertura nacional · ISO 9001:2015 · IMMEX</span>
          <span className={`${s.headline} ${spaceGrotesk.className}`}>
            Scrap que vuelve como <em>ingeniería</em>
          </span>
          <span className={s.lead}>Recuperamos, clasificamos y transformamos plásticos industriales en PC, ABS/PC, PA66, PP, POM y otras resinas listas para regresar a producción.</span>
          <span className={s.ctas}>
            <span className={s.accent}>Solicitar cotización</span>
            <span className={s.outline}>Ver materiales</span>
          </span>
          <span className={s.forms}>
            <span>Molido</span>
            <span>Pellet</span>
            <span>Scrap</span>
          </span>
        </span>
      </div>

      <div className={`${frame.frag} ${s.leads}`}>
        <span className={s.cardHead}>
          <span className={s.eyebrow}>Últimos leads</span>
          <span className={s.more}>Ver todos</span>
        </span>
        <span className={s.window}>
          <span className={s.track}>
            {LEADS.map((lead) => (
              <span key={lead.name} className={s.leadRow}>
                <span className={`${s.initials} ${spaceGrotesk.className}`}>{lead.initials}</span>
                <span className={s.who}>
                  <span className={s.name}>{lead.name}</span>
                  <span className={s.line}>{lead.line}</span>
                </span>
                <span className={`${s.pill} ${s[lead.status]}`}>{LEAD_STATUS[lead.status]}</span>
              </span>
            ))}
          </span>
        </span>
      </div>

      <div className={`${frame.frag} ${s.log}`}>
        <span className={s.cardHead}>
          <span className={s.eyebrow}>Bitácora de envíos</span>
          <span className={s.note}>Últimos 25 intentos</span>
        </span>
        <span className={s.table}>
          <span className={s.headRow}>
            <span>Fecha</span>
            <span>Tipo</span>
            <span>Estado</span>
          </span>
          <span className={s.window}>
            <span className={s.track}>
              {SENDS.map((send, i) => (
                <span key={i} className={s.sendRow}>
                  <span className={s.date}>{send.date}</span>
                  <span>
                    {send.kind}
                    {send.extra && <span className={s.extra}> · {send.extra}</span>}
                  </span>
                  <span className={s.state}>
                    <span className={`${s.status} ${s[send.status]}`}>{SEND_STATUS[send.status]}</span>
                    {send.ms && <span className={s.ms}>{send.ms} ms</span>}
                  </span>
                </span>
              ))}
            </span>
          </span>
        </span>
      </div>
    </div>
  );
}

interface LogoPath {
  d: string;
  green?: boolean;
}

/** The company's lockup in its negative version, as the site draws it over navy. */
function Logo() {
  return (
    <svg className={s.logo} viewBox="0 0 1461 311" aria-hidden>
      <g transform="translate(-305.59 -145.16) scale(1.3462)">
        {ISOTYPE.map((path) => (
          <path key={path.d.slice(0, 16)} d={path.d} fill={path.green ? "#83a33f" : "#f7f8f5"} />
        ))}
      </g>
      <g transform="translate(598.06 -373)">
        {WORDMARK.map((path) => (
          <path key={path.d.slice(0, 16)} d={path.d} fill={path.green ? "#83a33f" : "#f7f8f5"} />
        ))}
      </g>
    </svg>
  );
}

/* The vector data of the app's src/components/layout/logo-paths.ts, rounded to a tenth of a unit. */
const ISOTYPE: LogoPath[] = [
  { d: "M250.8,161.3c-.9,2.7-1.6,5.3-2.5,7.8-5.2,15.1-9,30.4-8.5,46.5,.4,16.5,5.2,31.2,18.1,42.4,5.3,4.6,11.7,5.5,18.2,5.7,13.2,.5,25.5-3.2,37.2-8.8,24-11.5,46.5-25.7,69.3-39.4,37.9-22.8,74.8-47.1,112-70.9,13-8.3,26.5-15.5,40.4-21.9,21.3-9.7,42.2-7.9,62.9,2.1,12,5.8,22.5,13.4,30.1,24.6,4.2,6.1,6.8,12.8,8,20,.2,1.1,.6,2.4-.4,3.2-.9,.8-1.8-.4-2.7-.7-13.1-5.4-25.9-3.3-38.7,1.4-14,5.2-25.8,14.1-37.8,22.6-45.5,32.4-92.7,62.1-141.6,89.2-20,11.1-40.1,21.8-61.9,29.2-18.2,6.2-36.8,10.4-56.1,9.6-19.5-.8-36.7-6.5-48.5-23.6-7.5-10.8-12.5-22.6-15.9-35.3-9.9-36.6-2.8-70.4,16.3-102.3,.4-.6,.7-1.3,2.2-1.2Z", green: true },
  { d: "M644.6,197.8c3.2,31.8,2.5,63-15.5,91-11.7,18.1-28.9,27.5-49.8,31.4-29,5.3-53.5-4.3-75.6-22.3-12.9-10.5-25.3-21.5-37.6-32.7-2.2-2-2.4-3,.4-4.7,15-9.2,29.8-18.7,44.7-28.1,2-1.2,3-1.1,4.7,.6,11.2,11.7,23.5,21.9,37.4,30.4,31,18.8,57.6,5.1,73.1-15.8,9.7-13.1,14.7-28.2,17.4-44.2,.3-1.8,.6-3.6,.9-5.4Z" },
  { d: "M267.8,254.1c-7.9-2.4-12.7-7.6-15.4-14.4-6.9-17.2-8.3-34.9-3.4-52.8,4.2-15.5,11-29.7,21.9-41.7,14.7-16.2,34.3-21.1,54.8-13.4,17.3,6.4,31.7,17.3,45.6,29,11.8,10.1,22.7,21.1,33.1,32.6,1.9,2.1,1.9,3.1-.7,4.7-13.1,7.8-26.1,15.7-39,23.8-2.4,1.5-3.4,1.4-5.1-1.1-11.2-16.2-24.6-30.2-42-39.8-6.8-3.8-14.5-6.3-22.3-4.7-15,3.1-25.3,12.5-31.6,26.2-5.9,12.9-4.4,26.1-.4,39.2,1.2,4,2.9,8,4.6,12.5Z" },
];

const WORDMARK: LogoPath[] = [
  { d: "M178.3,483.3c-9.2-25-27-40.8-54.1-44.2-23.9-3-44.2,3.9-59.3,23.5-.9,1.2-1.9,2.3-3.4,4.1,0-7.3-.1-13.7,.1-20,.1-2.9-.9-3.6-3.6-3.5-5.6,.2-11.3,.3-16.9,0-3.7-.2-4.5,1-4.5,4.5,.1,69.7,.1,139.5,.1,209.2,0,5.4,.1,10.8,0,16.1,0,2.1,.7,2.8,2.8,2.7,6.8-.1,13.5-.2,20.2,0,3.2,.1,3.9-.8,3.9-3.9-.1-25.4-.1-50.7,0-76.1,0-1.3-.4-2.7,.3-3.9,1.3-.1,1.7,1,2.3,1.7,17.5,19.6,39.6,24.5,64.4,19.4,24.7-5.1,40.4-21.3,48.6-44.4,10-28.3,9.5-57-.9-85.1ZM147.5,568.9c-17.4,28.1-60,29.8-75.6-3.8-12.1-26-11.8-52.9,.9-78.8,7.2-14.6,19.5-22.8,36.2-23.1,17.5-.3,30.4,7.6,39.2,22.5,7.6,12.9,9.8,27.1,9.9,40.1,0,16.4-2.7,30.4-10.6,43.1Z" },
  { d: "M223.1,525.2c0-26,.1-51.9-.1-77.9,0-3.3,.9-4.2,4.2-4.1,6.4,.3,12.7,.2,19.1,0,2.8-.1,3.7,.6,3.6,3.5-.2,11.1-.1,22.2-.1,33.3,0,41.1,0,82.2,.1,123.3,0,3.3-.8,4.3-4.2,4.2-6.2-.3-12.5-.2-18.7,0-3.1,.1-4-.8-4-3.9,.1-26.1,.1-52.2,.1-78.3Z" },
  { d: "M222.8,397.9c0-4.5,.1-9,0-13.5,0-2.1,.7-2.8,2.8-2.8,7.1,.1,14.2,.1,21.3,0,2.3,0,3,.8,3,3.1-.1,9.1-.1,18.2,0,27.3,0,2.2-.7,2.8-2.8,2.7-7.2-.1-14.5-.1-21.7,0-2,0-2.6-.6-2.6-2.6,.1-4.7,0-9.5,0-14.2Z" },
  { d: "M317.2,464.3c5.6-6,11.1-11.6,17.9-15.6,20.4-12.4,41.5-14,63.1-3.1,7.4,3.7,12.6,9.8,16.5,17,2.4,4.3,2.1,9.2,2.6,13.9,.9,9.1,1.1,18.2,1.1,27.3-.1,33.1-.1,66.2,.1,99.3,0,3.7-1,4.6-4.6,4.5-6.4-.3-12.7-.2-19.1,0-3.1,.1-4-.9-4-4,.1-35.9,.1-71.7,.1-107.6,0-6.9-.7-13.7-4.1-20-4.8-8.9-12.8-13.1-22.5-14.1-26.3-2.8-44.7,19-44.8,41.9-.1,33.1-.1,66.2,.1,99.3,0,3.4-.8,4.5-4.3,4.4-6.6-.3-13.2-.2-19.9,0-3,.1-3.7-.9-3.7-3.8,.1-35.5,.1-71,.1-106.4,0-16.7,.1-33.5-.1-50.2,0-3,.9-3.8,3.8-3.7,6.2,.2,12.5,.2,18.7,0,2.4-.1,3.3,.7,3.2,3.2-.2,6,0,12,0,18Z" },
  { d: "M517.1,541.7c0,20.5-.1,41,.1,61.5,0,3.3-.8,4.3-4.2,4.2-6.1-.3-12.2-.1-18.4-.1q-5.1,0-5.1-5c0-36.1,0-72.2,0-108.3,0-4.1-.5-8.2-1.6-12.2-3.4-11.4-13-19.1-24.9-20.1-8.2-.6-16,.4-23.1,4.6-2,1.2-2.9,.8-3.9-1.3-1.8-4-4-7.8-6.7-11.2-1.7-2.1-1.2-3.1,.9-4.6,11.8-8.6,25.2-11,39.4-10.7,9.2,.2,18.2,1.6,26.4,5.9,15.1,8,20.9,21.5,21.1,37.8,.2,19.9,.1,39.7,.1,59.6Z", green: true },
  { d: "M664.6,489c-.7,0-1.5,0-2.2,0-3.4,0-7.1,.9-10-.3-3.4-1.3-1.8-5.9-3-8.9-2.5-6.3-6.5-11.1-12.7-13.5-14.1-5.5-28.1-5.2-41.8,1.4-9.6,4.7-14.1,14.2-11.8,23.9,1.6,7.1,7,10.7,13,13.5,10.5,4.9,21.9,6.6,33.1,9.3,10.7,2.6,21.5,4.8,31.5,9.5,11.2,5.3,20.1,12.8,23.5,25.2,6.7,24.4-4.6,47.7-28.3,58.1-18.8,8.3-38.5,8.9-58.4,5.9-12.3-1.8-23.7-6.1-32.6-15.3-10-10.4-13.3-23.4-14.1-37.3-.1-1.6,.6-2.2,2.2-2.2,7.9,0,15.7,0,23.6,0,1.5,0,2.3,.6,2.5,2.1,0,.3,.1,.5,.1,.7,1.5,17,11.9,25.3,27.7,28.1,12.9,2.2,25.7,1.8,37.6-4.3,10.2-5.2,15-14.8,12.9-24.9-1.1-5.3-4.2-8.9-8.7-11.6-7-4.3-15.1-5.8-22.9-7.7-13.5-3.4-27.3-5.9-40.4-11.1-3.2-1.3-6.4-2.7-9.5-4.3-17.1-8.9-22.6-22.6-21-41,1.7-18.8,12.1-31.8,29.2-38.9,22.5-9.3,45.6-9.7,68.2-.2,17.7,7.5,25.5,22.2,26.8,40.9,.2,2.4-.6,3.4-3.1,3.3-3.7-.2-7.5,0-11.2,0Z" },
  { d: "M858.8,592.3c-11,.9-15.8-3.8-15.8-15,0-14.9,0-29.7,0-47.9-.3-13.8,.2-30.9-.2-48-.5-20.5-12.5-32.8-28.8-38.1-21-6.8-42.3-6.9-63.5-.8-24.2,7-36.3,22.8-36.9,46.3-.1,2.3,.5,3.1,2.8,3.1,7-.1,14-.1,21,0,2.4,.1,3-.9,3.4-3.2,2-12,8.5-20.4,20.6-23.6,12.8-3.5,25.7-3.4,38.4,.7,9.7,3.1,16,9.6,16.6,20.3,.2,3.1,0,6.2-.1,9.4-.3,6.5-3.9,10.5-9.8,12.8-5.4,2.1-11.1,2.9-16.8,3.7-14.1,1.9-28.3,3.2-42.2,6.3-11.8,2.7-22.5,7.4-30.7,16.7-9.5,10.7-11.5,23.6-10.2,37.2,1.7,17.5,10.5,30.2,26.7,37.2,15.4,6.6,31.3,6.9,47.4,2.9,12.5-3.1,23.1-9.8,32.8-18.1,3.7-3.2,3.7-3.2,4.8,1.4,2.7,11.8,8.7,17.3,20.7,18.9,7.4,1,14.7-.2,21.9-1.9,1.8-.4,2.3-1.4,2.2-3.2-.1-4.4-.2-8.8,0-13.1,.2-3.3-.6-4.1-4.1-3.8ZM807.3,575.3c-16.6,15.2-35.6,20-57.1,13.5-9.7-3-15.2-10.2-16.1-20.4-1-10.3,2.1-18.7,11.3-24.3,9.9-6,21-7.5,32.2-9.1,11.2-1.6,22.6-2.6,33.4-6.3q5.4-1.9,5.4,4.1c0,3.6,0,7.2,0,10.9s-.1,7,0,10.5c.2,8.5-2.7,15.6-9,21.3Z" },
];
