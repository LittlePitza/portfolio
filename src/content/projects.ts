import type { Localized } from "@/i18n/config";

export interface Metric {
  value: string;
  label: Localized;
}

export interface Project {
  slug: string;
  name: string;
  category: Localized;
  role: Localized<string[]>;
  stack: string[];
  launch: Localized;
  status: Localized;
  numbers: Metric[];
  summary: Localized;
  body: Localized<string[]>;
  links?: { label: string; href: string }[];
  /** Accent used on the cover placeholder and swatches. */
  color: string;
  /** Optional screenshot under /public/covers. Falls back to a generated cover. */
  cover?: string;
}

export const projects: Project[] = [
  {
    slug: "ti-hub",
    name: "TI Hub",
    category: { en: "Internal platform", es: "Plataforma interna" },
    role: {
      en: ["Sole author", "Architecture", "Product owner"],
      es: ["Autor único", "Arquitectura", "Dueño del producto"],
    },
    stack: ["Next.js 15", "React 19", "TypeScript", "Supabase", "PostgreSQL"],
    launch: { en: "2026", es: "2026" },
    status: { en: "In production", es: "En producción" },
    numbers: [
      { value: "160", label: { en: "tests", es: "pruebas" } },
      { value: "19", label: { en: "RLS policies", es: "políticas RLS" } },
      { value: "23", label: { en: "routes", es: "rutas" } },
      { value: "5", label: { en: "CI stages", es: "etapas de CI" } },
    ],
    summary: {
      en: "IT service desk with an SLA engine, inventory, maintenance, custody letters and monthly KPI reporting, plus a friction-free portal for any worker to file a report.",
      es: "Mesa de ayuda con motor de SLA, inventario, mantenimiento, cartas responsiva y KPIs mensuales, más un portal sin fricción para que cualquier trabajador reporte.",
    },
    body: {
      en: [
        "The SLA engine tracks per-priority response and resolution targets in clock hours, flags tickets at an 80% due-soon threshold, pauses the clock while a ticket is on hold, and takes runtime overrides from the admin panel instead of hardcoded values.",
        "The monthly KPI report is derived from immutable timestamps with no snapshot tables, so any closed month can be reconstructed: created, responded and resolved cohorts, backlog at close, per-service availability and a six-month trend.",
        "The mail layer was designed for the Microsoft 365 basic-SMTP retirement: three send methods, basic SMTP, Microsoft Graph app-only and interactive OAuth, with credentials stored in the database so the method can change without a redeploy.",
        "Free-tier gaps are covered with purpose-built infrastructure: a daily GPG AES256-encrypted dump published as a 30-day artifact with five verification assertions, plus a daily keepalive against the inactivity pause.",
      ],
      es: [
        "El motor de SLA maneja metas de respuesta y resolución por prioridad en horas de reloj, marca tickets al 80% como «por vencer», pausa el reloj en estado de espera y toma anulaciones desde el panel en vez de valores fijos en el código.",
        "El reporte mensual de KPIs se deriva de marcas de tiempo inmutables, sin tablas de snapshot, de modo que cualquier mes cerrado puede reconstruirse: cohortes de creados, respondidos y resueltos, backlog al cierre, disponibilidad por servicio y tendencia de seis meses.",
        "La capa de correo se diseñó para el retiro del SMTP básico de Microsoft 365: tres métodos de envío, SMTP básico, Microsoft Graph app-only y OAuth interactivo, con credenciales en base de datos para cambiar de método sin redesplegar.",
        "Las carencias del plan gratuito se cubren con infraestructura propia: respaldo diario cifrado con GPG AES256 publicado como artefacto de 30 días con cinco aserciones de verificación, más un latido diario contra la pausa por inactividad.",
      ],
    },
    links: [{ label: "github.com/LittlePitza/ti-hub", href: "https://github.com/LittlePitza/ti-hub" }],
    color: "#FF4A1C",
  },
  {
    slug: "attendance",
    name: "Attendance",
    category: { en: "Internal system", es: "Sistema interno" },
    role: { en: ["Sole author", "Database design"], es: ["Autor único", "Diseño de base de datos"] },
    stack: ["PostgreSQL", "PL/pgSQL", "pg_cron", "Supabase", "Docker"],
    launch: { en: "2026", es: "2026" },
    status: { en: "In production", es: "En producción" },
    numbers: [
      { value: "345", label: { en: "SQL assertions", es: "aserciones SQL" } },
      { value: "27", label: { en: "migrations", es: "migraciones" } },
      { value: "12,990", label: { en: "lines of SQL", es: "líneas de SQL" } },
      { value: "0", label: { en: "app servers", es: "servidores de app" } },
    ],
    summary: {
      en: "Time clock for home-office staff with no application server: every business rule lives in PostgreSQL, punches are append-only and the client holds no write privilege on any table.",
      es: "Checador para personal en home office sin servidor de aplicación: toda regla de negocio vive en PostgreSQL, las marcas son append-only y el cliente no tiene privilegio de escritura sobre ninguna tabla.",
    },
    body: {
      en: [
        "The server sets the timestamp. Punches are append-only, enforced by trigger, and corrected only through auditable adjustments.",
        "Every rule lives in SECURITY DEFINER functions across 27 migrations. An alert engine with seven kinds runs on pg_cron and is idempotent by unique key.",
        "345 SQL assertions run against a disposable Dockerised database in CI on every push.",
      ],
      es: [
        "El sello de tiempo lo pone el servidor. Las marcas son append-only, forzadas por trigger, y se corrigen solo con ajustes auditables.",
        "Toda regla vive en funciones SECURITY DEFINER a lo largo de 27 migraciones. Un motor de alertas con siete tipos corre sobre pg_cron y es idempotente por clave única.",
        "345 aserciones SQL corren contra una base desechable en Docker dentro de CI en cada push.",
      ],
    },
    color: "#1FA37A",
  },
  {
    slug: "maintenance",
    name: "Maintenance portal",
    category: { en: "Internal platform", es: "Plataforma interna" },
    role: { en: ["Sole author", "PWA"], es: ["Autor único", "PWA"] },
    stack: ["Next.js 16", "Tailwind v4", "Supabase", "Serwist"],
    launch: { en: "2026", es: "2026" },
    status: { en: "In production", es: "En producción" },
    numbers: [
      { value: "5", label: { en: "sites", es: "plantas" } },
      { value: "3", label: { en: "customer-site centres", es: "centros en sitio de cliente" } },
      { value: "PWA", label: { en: "installable", es: "instalable" } },
    ],
    summary: {
      en: "Work orders with assignment, log, per-machine history and statistics, scoped across five sites including customer-site service centres at BRP, Hella and Faurecia.",
      es: "Órdenes de trabajo con asignación, bitácora, historial por máquina y estadísticas, con alcance multiempresa sobre cinco plantas, incluidos centros de servicio en sitio de cliente (BRP, Hella, Faurecia).",
    },
    body: {
      en: [
        "Multi-company scope: one deployment serves the plant and the service centres that operate inside customer facilities, with row-level isolation between them.",
        "Built as a progressive web app so technicians install it on the shop floor and file from a phone.",
      ],
      es: [
        "Alcance multiempresa: un solo despliegue atiende la planta y los centros de servicio que operan dentro de instalaciones de clientes, con aislamiento a nivel de fila entre ellos.",
        "Construido como PWA para que los técnicos lo instalen en piso y reporten desde el teléfono.",
      ],
    },
    color: "#2757FF",
  },
  {
    slug: "marketplace",
    name: "B2B Marketplace",
    category: { en: "E-commerce", es: "Comercio electrónico" },
    role: { en: ["Sole author", "Security audit"], es: ["Autor único", "Auditoría de seguridad"] },
    stack: ["Next.js 16", "Zod v4", "Stripe", "SPEI", "PostgreSQL"],
    launch: { en: "September 2026", es: "Septiembre 2026" },
    status: { en: "Live, multi-vendor", es: "En venta, multivendedor" },
    numbers: [
      { value: "100%", label: { en: "prices derived server-side", es: "precios derivados en servidor" } },
      { value: "0", label: { en: "client write privileges", es: "privilegios de escritura del cliente" } },
    ],
    summary: {
      en: "Recycled-plastics commerce with direct purchase and RFQ. Selling to invited customers since 1 September 2026, multi-vendor in production since 15 September.",
      es: "Comercio de plásticos reciclados con compra directa y cotización. En venta a clientes invitados desde el 1 de septiembre de 2026, multivendedor en producción desde el 15 de septiembre.",
    },
    body: {
      en: [
        "Before launch I audited the marketplace against the live database inside aborted transactions and proved a customer could set their own price. The fix derives every price in the database and revokes client writes.",
        "Checkout supports card via Stripe and bank transfer via SPEI, the Mexican interbank system.",
      ],
      es: [
        "Antes del lanzamiento auditó el marketplace contra la base real dentro de transacciones abortadas y demostró que un cliente podía fijar su propio precio. La corrección deriva todo precio en la base de datos y revoca la escritura del cliente.",
        "El pago acepta tarjeta con Stripe y transferencia por SPEI.",
      ],
    },
    color: "#8B3DFF",
  },
  {
    slug: "meetscribe",
    name: "MeetScribe",
    category: { en: "Open source", es: "Código abierto" },
    role: { en: ["Author", "Audio pipeline"], es: ["Autor", "Pipeline de audio"] },
    stack: ["Python", "Whisper", "WASAPI", "Windows"],
    launch: { en: "2026", es: "2026" },
    status: { en: "MIT licence", es: "Licencia MIT" },
    numbers: [
      { value: "329", label: { en: "tests", es: "pruebas" } },
      { value: "2", label: { en: "audio tracks", es: "pistas de audio" } },
      { value: "0", label: { en: "bytes leave the machine", es: "bytes salen del equipo" } },
    ],
    summary: {
      en: "Real-time meeting transcription and minutes, fully local on Windows: dual-track WASAPI capture, CPU Whisper and on-device diarisation.",
      es: "Transcripción de reuniones y minutas en tiempo real, 100% local en Windows: captura WASAPI en dos pistas, Whisper en CPU y diarización en el dispositivo.",
    },
    body: {
      en: [
        "Captures the microphone and the system loopback as separate tracks, so who said what is known before any model runs.",
        "Runs Whisper on CPU with on-device diarisation. Nothing is uploaded, which is the point for meetings about budgets and contracts.",
      ],
      es: [
        "Captura el micrófono y el loopback del sistema como pistas separadas, así que quién dijo qué se sabe antes de correr cualquier modelo.",
        "Corre Whisper en CPU con diarización en el dispositivo. Nada se sube, que es el punto en reuniones sobre presupuestos y contratos.",
      ],
    },
    links: [{ label: "github.com/LittlePitza/meetscribe", href: "https://github.com/LittlePitza/meetscribe" }],
    color: "#0FA3B1",
  },
  {
    slug: "password-vault",
    name: "Password Vault",
    category: { en: "Browser extension", es: "Extensión de navegador" },
    role: { en: ["Author", "Cryptography"], es: ["Autor", "Criptografía"] },
    stack: ["Manifest V3", "AES-256-GCM", "scrypt", "TypeScript"],
    launch: { en: "2026", es: "2026" },
    status: { en: "Chrome & Edge", es: "Chrome y Edge" },
    numbers: [
      { value: "216", label: { en: "tests", es: "pruebas" } },
      { value: "2×", label: { en: "OWASP scrypt minimum", es: "mínimo OWASP de scrypt" } },
    ],
    summary: {
      en: "Local password manager for Chrome and Edge. Envelope encryption with AES-256-GCM and scrypt derivation at twice the OWASP minimum; keys live only in the service worker.",
      es: "Gestor de contraseñas local para Chrome y Edge. Cifrado por sobres con AES-256-GCM y derivación scrypt al doble del mínimo OWASP; las llaves viven solo en el service worker.",
    },
    body: {
      en: [
        "Envelope encryption: a master key derived with scrypt wraps per-entry data keys, so rotating the master never re-encrypts the vault.",
        "Keys never touch the content script or storage in clear. The popup asks the service worker to decrypt on demand.",
      ],
      es: [
        "Cifrado por sobres: una llave maestra derivada con scrypt envuelve llaves de datos por entrada, así que rotar la maestra nunca recifra la bóveda.",
        "Las llaves nunca tocan el content script ni el almacenamiento en claro. El popup pide al service worker descifrar bajo demanda.",
      ],
    },
    color: "#E0245E",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
