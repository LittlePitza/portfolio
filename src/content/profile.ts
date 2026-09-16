import type { Localized } from "@/i18n/config";

/** Personal, huyml-style facts. Lines marked TODO are for Luis to replace. */
export const facts: Localized<string[]> = {
  en: [
    "Sole IT lead for 36 people and 66 computing assets",
    "Reports straight to the General Director",
    "Ships to production from a plastics plant in Huimilpan",
    "Computer engineering, UAEM, thesis pending",
    "Google Cybersecurity certificate in progress",
    "TODO: something personal, e.g. what you do off-screen",
    "TODO: one more, keep it short and true",
  ],
  es: [
    "Responsable único de TI para 36 personas y 66 activos de cómputo",
    "Reporta directo a Dirección General",
    "Despliega a producción desde una planta de plásticos en Huimilpan",
    "Ingeniería en Computación, UAEM, titulación en proceso",
    "Certificado Google Cybersecurity en curso",
    "TODO: algo personal, por ejemplo qué haces fuera de la pantalla",
    "TODO: una más, corta y verdadera",
  ],
};

export const numbers: { value: string; label: Localized }[] = [
  { value: "5", label: { en: "production codebases, sole author", es: "bases de código en producción, autor único" } },
  { value: "1,050", label: { en: "automated tests across projects", es: "pruebas automatizadas en total" } },
  { value: "93%", label: { en: "response within SLA, target 85%", es: "respuesta dentro de SLA, meta 85%" } },
  { value: "100%", label: { en: "availability across six services", es: "disponibilidad en seis servicios" } },
  { value: "-28%", label: { en: "IT spend in three months", es: "gasto de TI en tres meses" } },
  { value: "20+", label: { en: "devices managed in Intune", es: "equipos administrados en Intune" } },
  { value: "27", label: { en: "clauses negotiated into the SAP contract", es: "cláusulas negociadas en el contrato SAP" } },
  { value: "1", label: { en: "impersonation attack stopped", es: "ataque de suplantación detenido" } },
];

export const capabilities: Localized<{ title: string; items: string[] }[]> = {
  en: [
    { title: "Full-stack", items: ["Next.js 15/16", "React 19", "TypeScript strict", "Tailwind v4", "PWA"] },
    { title: "Data", items: ["PostgreSQL", "RLS & SECURITY DEFINER", "pg_cron", "Supabase", "Drizzle"] },
    { title: "Platform", items: ["Microsoft 365", "Entra ID", "Intune", "Microsoft Graph", "Hyper-V", "UniFi"] },
    { title: "Security", items: ["Incident response", "OAuth 2.0", "AES-256-GCM", "Strict CSP", "Threat modelling"] },
    { title: "Governance", items: ["SAP Business One lead", "ISO 9001", "Budgets & vendors", "SLA & KPIs"] },
  ],
  es: [
    { title: "Full-stack", items: ["Next.js 15/16", "React 19", "TypeScript estricto", "Tailwind v4", "PWA"] },
    { title: "Datos", items: ["PostgreSQL", "RLS y SECURITY DEFINER", "pg_cron", "Supabase", "Drizzle"] },
    { title: "Plataforma", items: ["Microsoft 365", "Entra ID", "Intune", "Microsoft Graph", "Hyper-V", "UniFi"] },
    { title: "Seguridad", items: ["Respuesta a incidentes", "OAuth 2.0", "AES-256-GCM", "CSP estricta", "Modelado de amenazas"] },
    { title: "Gobierno", items: ["Líder SAP Business One", "ISO 9001", "Presupuesto y proveedores", "SLA y KPIs"] },
  ],
};

export const process: Localized<{ step: string; title: string; text: string }[]> = {
  en: [
    { step: "P1", title: "Diagnose in writing", text: "Before touching anything, the gap goes on paper. My own ISO 9001 diagnostic named my department's worst finding." },
    { step: "P2", title: "Rules in the database", text: "Business rules live in PostgreSQL. The client gets no write privilege it does not need." },
    { step: "P3", title: "Tests in CI", text: "SQL assertions against a disposable database, Vitest on the app, five-stage pipeline before anything ships." },
    { step: "P4", title: "Ship to real users", text: "Internal tools go live for the people who asked for them, on the shop floor, the same week." },
    { step: "P5", title: "Report the KPIs", text: "The numbers I report come out of the systems I wrote, including the unflattering ones." },
    { step: "P6", title: "Iterate", text: "Overrides from the panel, not from a redeploy. The system changes with the operation." },
  ],
  es: [
    { step: "P1", title: "Diagnosticar por escrito", text: "Antes de tocar nada, la brecha va en papel. Mi propio diagnóstico ISO 9001 señaló el peor hallazgo de mi departamento." },
    { step: "P2", title: "Reglas en la base de datos", text: "Las reglas de negocio viven en PostgreSQL. El cliente no recibe ningún privilegio de escritura que no necesite." },
    { step: "P3", title: "Pruebas en CI", text: "Aserciones SQL contra una base desechable, Vitest en la app, pipeline de cinco etapas antes de publicar." },
    { step: "P4", title: "Entregar a usuarios reales", text: "Las herramientas internas salen a producción para quien las pidió, en piso, la misma semana." },
    { step: "P5", title: "Reportar los KPIs", text: "Las cifras que reporto salen de los sistemas que escribí, incluidas las que no favorecen." },
    { step: "P6", title: "Iterar", text: "Anulaciones desde el panel, no desde un redespliegue. El sistema cambia con la operación." },
  ],
};

export interface Role {
  company: string;
  place: string;
  title: Localized;
  from: string;
  to: string | null;
}

export const experience: Role[] = [
  { company: "PIMSA", place: "Huimilpan, Querétaro", title: { en: "IT Manager · Internal systems engineering", es: "Responsable de TI · Desarrollo de sistemas internos" }, from: "2026-06", to: null },
  { company: "Construcciones SB", place: "Querétaro", title: { en: "Systems Administrator", es: "Administrador de Sistemas" }, from: "2025-12", to: "2026-05" },
  { company: "Foton Querétaro", place: "Querétaro", title: { en: "IT Specialist", es: "Especialista en TI" }, from: "2025-07", to: "2025-12" },
  { company: "Centro de Abastos Fany", place: "Atlacomulco", title: { en: "Information Systems Supervisor", es: "Supervisor de Sistemas de Información" }, from: "2024-01", to: "2025-07" },
  { company: "Mercado Libre", place: "Remote", title: { en: "Logistics Specialist", es: "Especialista en Logística" }, from: "2019-12", to: "2023-05" },
];

export const education: Localized<string[]> = {
  en: [
    "BEng Computer Engineering, Universidad Autónoma del Estado de México, thesis pending",
    "Google Cybersecurity Certificate, in progress",
    "Google IT Support, in progress",
    "Git & GitHub and Object-Oriented Programming, Platzi",
  ],
  es: [
    "Ingeniería en Computación, Universidad Autónoma del Estado de México, titulación en proceso",
    "Google Cybersecurity Certificate, en curso",
    "Google IT Support, en curso",
    "Curso Profesional de Git y GitHub y Programación Orientada a Objetos, Platzi",
  ],
};
