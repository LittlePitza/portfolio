import type { Localized } from "@/i18n/config";

export type HeadIcon = "database" | "pipeline" | "lock" | "pellet" | "report" | "cube" | "coffee" | "mic";

export interface HeadItem {
  icon: HeadIcon;
  title: Localized;
  /** Told by the object itself, huyml-style. Every figure is from the CV. */
  story: Localized;
  signature: Localized;
}

/** What floats out when the head opens on the About page. Add, remove or rewrite freely. */
export const headItems: HeadItem[] = [
  {
    icon: "database",
    title: { en: "The database", es: "La base de datos" },
    story: {
      en: "Every business rule lives in me. Twenty-seven migrations, 12,990 lines of SQL, and he still won't let the client write a single row. Punches are append-only; I enforce it with a trigger.",
      es: "Toda regla de negocio vive en mí. Veintisiete migraciones, 12,990 líneas de SQL, y sigue sin dejar que el cliente escriba una sola fila. Las marcas son append-only; lo fuerzo con un trigger.",
    },
    signature: { en: "The tables, append-only", es: "Las tablas, append-only" },
  },
  {
    icon: "pipeline",
    title: { en: "The pipeline", es: "El pipeline" },
    story: {
      en: "Five stages before anything ships. 1,050 tests across his repositories, 345 of them SQL assertions against a database I throw away after every run. I fail loudly so that users never have to.",
      es: "Cinco etapas antes de publicar nada. 1,050 pruebas en sus repositorios, 345 de ellas aserciones SQL contra una base que tiro después de cada corrida. Fallo a gritos para que los usuarios nunca tengan que hacerlo.",
    },
    signature: { en: "CI, still green", es: "CI, todavía en verde" },
  },
  {
    icon: "lock",
    title: { en: "Security", es: "Seguridad" },
    story: {
      en: "Someone impersonated the General Director through Teams federation. He read the Entra ID audit logs, reset six accounts, revoked their tokens, blocked the domain, and then wrote the company's cybersecurity policy. I have been busier since.",
      es: "Alguien suplantó al Director General por federación de Teams. Él leyó los registros de auditoría de Entra ID, restableció seis cuentas, revocó sus tokens, bloqueó el dominio y luego escribió la política de ciberseguridad de la empresa. Desde entonces tengo más trabajo.",
    },
    signature: { en: "The padlock, no longer decorative", es: "El candado, ya no decorativo" },
  },
  {
    icon: "pellet",
    title: { en: "The plant", es: "La planta" },
    story: {
      en: "Recycled plastics in Huimilpan, Querétaro. Thirty-six people, sixty-six computing devices, one IT lead. The WiFi now has corporate, guest and IoT VLANs, and the payroll survives a dead hard drive.",
      es: "Plásticos reciclados en Huimilpan, Querétaro. Treinta y seis personas, sesenta y seis equipos de cómputo, un responsable de TI. El WiFi ahora tiene VLANs corporativa, de invitados y de IoT, y la nómina sobrevive a un disco muerto.",
    },
    signature: { en: "A pellet from the floor", es: "Un pellet del piso" },
  },
  {
    icon: "report",
    title: { en: "The monthly report", es: "El reporte mensual" },
    story: {
      en: "August 2026: 93% response within SLA against a target of 85%, 100% availability across six services, spend at 94% of the ceiling. The unflattering number is on the same page: resolution within SLA was 72%. He does not hide it.",
      es: "Agosto de 2026: 93% de respuesta dentro de SLA contra una meta de 85%, 100% de disponibilidad en seis servicios, gasto al 94% del techo. La cifra incómoda va en la misma página: resolución dentro de SLA, 72%. No la esconde.",
    },
    signature: { en: "Generated, not assembled", es: "Generado, no armado a mano" },
  },
  {
    icon: "cube",
    title: { en: "The ERP", es: "El ERP" },
    story: {
      en: "SAP Business One, go-live on 11 December 2026. Before signing he negotiated twenty-seven changes into the contract, including Priority 1 support that now means four hours to resolve, not four hours to start looking.",
      es: "SAP Business One, arranque el 11 de diciembre de 2026. Antes de firmar negoció veintisiete cambios en el contrato, incluido el soporte de Prioridad 1, que ahora significa cuatro horas para resolver y no cuatro para empezar a mirar.",
    },
    signature: { en: "The cube, under contract", es: "El cubo, bajo contrato" },
  },
  {
    icon: "mic",
    title: { en: "The microphone", es: "El micrófono" },
    story: {
      en: "He records his own meetings and transcribes them on the CPU, offline, two audio tracks so I know who said what. Nothing leaves the laptop. 329 tests say so, and the licence is MIT.",
      es: "Graba sus propias reuniones y las transcribe en el CPU, sin conexión, en dos pistas de audio para que yo sepa quién dijo qué. Nada sale de la laptop. 329 pruebas lo respaldan, y la licencia es MIT.",
    },
    signature: { en: "MeetScribe, listening locally", es: "MeetScribe, escuchando en local" },
  },
  {
    icon: "coffee",
    title: { en: "Coffee", es: "Café" },
    story: {
      en: "Present at every migration, every contract review and every go-live rehearsal. I am the only dependency in this portfolio without a test suite.",
      es: "Presente en cada migración, cada revisión de contrato y cada ensayo de arranque. Soy la única dependencia de este portafolio sin suite de pruebas.",
    },
    signature: { en: "The cup, refilled", es: "La taza, rellenada" },
  },
];
