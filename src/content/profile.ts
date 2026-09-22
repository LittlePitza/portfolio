import type { Localized } from "@/i18n/config";

/** Personal context; professional background is detailed below. */
export const facts: Localized<string[]> = {
  en: [
    "Based in Querétaro, Mexico",
    "Software development with hands-on IT operations experience",
    "Board games, chess and video games, in that order of table space",
    "Pizza, coffee and music, in no particular order",
  ],
  es: [
    "En Querétaro, México",
    "Desarrollo de software con experiencia en operación de TI",
    "Juegos de mesa, ajedrez y videojuegos, en ese orden de espacio en la mesa",
    "Pizza, café y música, sin orden particular",
  ],
};

interface Capability {
  id: string;
  title: Localized;
  description: Localized;
  groups: { label: Localized; items: Localized<string[]> }[];
}

/** Technologies supported by the project catalogue and Luis's professional background. */
export const capabilities: Capability[] = [
  {
    id: "development",
    title: { en: "Software development", es: "Desarrollo de software" },
    description: { en: "Web applications, internal tools and interfaces built around the people who use them.", es: "Aplicaciones web, herramientas internas e interfaces pensadas para quienes las usan." },
    groups: [
      { label: { en: "Languages", es: "Lenguajes" }, items: { en: ["TypeScript", "JavaScript", "Python", "Java", "SQL", "Bash", "PowerShell", "HTML", "CSS"], es: ["TypeScript", "JavaScript", "Python", "Java", "SQL", "Bash", "PowerShell", "HTML", "CSS"] } },
      { label: { en: "Frameworks", es: "Frameworks" }, items: { en: ["React", "Next.js", "Django"], es: ["React", "Next.js", "Django"] } },
      { label: { en: "Interfaces", es: "Interfaces" }, items: { en: ["Tailwind CSS", "CSS Modules", "Zustand", "Framer Motion", "GSAP", "Lenis"], es: ["Tailwind CSS", "CSS Modules", "Zustand", "Framer Motion", "GSAP", "Lenis"] } },
      { label: { en: "Tools & quality", es: "Herramientas y calidad" }, items: { en: ["Git", "GitHub", "Vite", "Docker", "Vitest", "ESLint", "GitHub Actions", "Zod"], es: ["Git", "GitHub", "Vite", "Docker", "Vitest", "ESLint", "GitHub Actions", "Zod"] } },
    ],
  },
  {
    id: "data",
    title: { en: "Databases", es: "Bases de datos" },
    description: { en: "Data modelling, business rules, access control and scheduled jobs.", es: "Modelado de datos, reglas de negocio, control de acceso y tareas programadas." },
    groups: [
      { label: { en: "Technologies", es: "Tecnologías" }, items: { en: ["SQL", "PostgreSQL", "MySQL", "PL/pgSQL", "Supabase", "Drizzle", "pg_cron"], es: ["SQL", "PostgreSQL", "MySQL", "PL/pgSQL", "Supabase", "Drizzle", "pg_cron"] } },
      { label: { en: "Practice", es: "Práctica" }, items: { en: ["Schema migrations", "Row-level security (RLS)", "SECURITY DEFINER functions", "SQL assertions"], es: ["Migraciones de esquema", "Seguridad por fila (RLS)", "Funciones SECURITY DEFINER", "Aserciones SQL"] } },
    ],
  },
  {
    id: "integrations",
    title: { en: "Integrations & platforms", es: "Integraciones y plataformas" },
    description: { en: "Payments, business services, installable applications and local audio processing.", es: "Pagos, servicios empresariales, aplicaciones instalables y procesamiento local de audio." },
    groups: [
      { label: { en: "Services", es: "Servicios" }, items: { en: ["Microsoft Graph", "Google APIs", "Stripe", "SPEI", "Vercel"], es: ["Microsoft Graph", "Google APIs", "Stripe", "SPEI", "Vercel"] } },
      { label: { en: "Applications", es: "Aplicaciones" }, items: { en: ["PWA", "Serwist", "Browser extensions (Manifest V3)", "Whisper", "WASAPI"], es: ["PWA", "Serwist", "Extensiones de navegador (Manifest V3)", "Whisper", "WASAPI"] } },
    ],
  },
  {
    id: "infrastructure",
    title: { en: "Infrastructure & IT operations", es: "Infraestructura y operación de TI" },
    description: { en: "Server, network and device administration, supporting day-to-day operations.", es: "Administración de servidores, redes y dispositivos para sostener la operación diaria." },
    groups: [
      { label: { en: "Systems & networks", es: "Sistemas y redes" }, items: { en: ["Windows Server", "Linux", "Windows", "macOS", "Android", "VMware", "Hyper-V", "Ubiquiti / UniFi", "Fortinet (firewall, VPN)", "Video surveillance"], es: ["Windows Server", "Linux", "Windows", "macOS", "Android", "VMware", "Hyper-V", "Ubiquiti / UniFi", "Fortinet (firewall, VPN)", "Videovigilancia"] } },
      { label: { en: "Administration", es: "Administración" }, items: { en: ["Active Directory", "Microsoft 365", "Entra ID", "Intune", "Device management", "User provisioning", "Backups & recovery"], es: ["Active Directory", "Microsoft 365", "Entra ID", "Intune", "Administración de dispositivos", "Aprovisionamiento de usuarios", "Respaldos y recuperación"] } },
    ],
  },
  {
    id: "security",
    title: { en: "Security", es: "Seguridad" },
    description: { en: "Access controls and data protection, from application design to incident response.", es: "Control de acceso y protección de datos, desde el diseño de aplicaciones hasta la respuesta a incidentes." },
    groups: [
      { label: { en: "Technologies", es: "Tecnologías" }, items: { en: ["OAuth 2.0", "AES-256-GCM", "scrypt", "Content Security Policy"], es: ["OAuth 2.0", "AES-256-GCM", "scrypt", "Content Security Policy"] } },
      { label: { en: "Practice", es: "Práctica" }, items: { en: ["Threat modelling", "Least privilege", "Incident response"], es: ["Modelado de amenazas", "Mínimo privilegio", "Respuesta a incidentes"] } },
    ],
  },
  {
    id: "management",
    title: { en: "Projects & technology leadership", es: "Proyectos y gestión tecnológica" },
    description: { en: "Leading the restructuring of an IT department and the technology projects that run through it, from planning and cost analysis to delivery, training and operation.", es: "Liderazgo de la reestructuración de un departamento de sistemas y de los proyectos tecnológicos que pasan por él, desde la planeación y el análisis de costos hasta la entrega, la capacitación y la operación." },
    groups: [
      { label: { en: "Tools", es: "Herramientas" }, items: { en: ["SAP Business One", "Infor Visual (ERP)", "Microsoft 365", "Jira", "Excel (dashboards & macros)", "Service desk (own build)"], es: ["SAP Business One", "Infor Visual (ERP)", "Microsoft 365", "Jira", "Excel (dashboards y macros)", "Mesa de servicio (desarrollo propio)"] } },
      { label: { en: "Responsibilities", es: "Responsabilidades" }, items: { en: ["Project leadership", "Department restructuring", "Technology innovation", "Cost reduction", "Budgets & vendors", "SLA & KPIs", "ISO 9001 processes", "Training & onboarding"], es: ["Liderazgo de proyectos", "Reestructuración del departamento", "Innovación tecnológica", "Reducción de costos", "Presupuesto y proveedores", "SLA y KPIs", "Procesos ISO 9001", "Capacitación de nuevos ingresos"] } },
    ],
  },
];

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
  place: Localized;
  title: Localized;
  from: string;
  to: string | null;
  /** The scope of the role, in one line. */
  summary: Localized;
  /** What the role answers for, day to day. */
  responsibilities?: Localized<string[]>;
  /** What changed because of it. */
  achievements?: Localized<string[]>;
}

export const experience: Role[] = [
  {
    company: "PIMSA",
    place: { en: "Huimilpan, Querétaro", es: "Huimilpan, Querétaro" },
    title: { en: "IT Manager · Internal systems engineering", es: "Responsable de TI · Desarrollo de sistemas internos" },
    from: "2026-06",
    to: null,
    summary: {
      en: "Sole owner of the IT function of a recycled-plastics plant: its cost centre, its infrastructure, its service desk and the software the department runs on.",
      es: "Responsable único de la función de TI de una planta de reciclado de plásticos: su centro de costo, su infraestructura, su mesa de servicio y el software con el que opera el departamento.",
    },
    responsibilities: {
      en: [
        "Running the IT department: service catalogue, processes, budget, vendors and contracts.",
        "Managing internal technology projects alongside production, maintenance, sales and administration.",
        "Building the software the company runs on: service desk, time clock, maintenance portal, B2B marketplace and public website.",
        "Administering infrastructure, network, backups and Microsoft 365 across the plant.",
        "User support against per-priority SLAs, with monthly KPI reporting to management.",
        "Training new hires on SAP Business One, Microsoft 365 and the company's internal software.",
      ],
      es: [
        "Dirección del departamento de sistemas: catálogo de servicios, procesos, presupuesto, proveedores y contratos.",
        "Gestión de proyectos internos de tecnología junto con producción, mantenimiento, comercial y administración.",
        "Desarrollo del software con el que opera la empresa: mesa de servicio, control de asistencia, portal de mantenimiento, marketplace B2B y sitio web público.",
        "Administración de la infraestructura, la red, los respaldos y Microsoft 365 de toda la planta.",
        "Soporte a usuarios con SLA por prioridad y reporte mensual de KPIs a dirección.",
        "Capacitación de nuevos ingresos en SAP Business One, Microsoft 365 y el software interno de la compañía.",
      ],
    },
    achievements: {
      en: [
        "Led the department restructuring project, from defining services and processes to putting them into operation.",
        "Applied ISO 9001 to the department's quality processes: diagnostic, documented procedures, findings and corrective actions.",
        "Cut the cost of the area at every renewal: internal development when the tool was the problem, a different vendor or solution when the alternative was better.",
        "Replaced paper processes and external licences with internal systems now in production.",
      ],
      es: [
        "Lideré el proyecto de reestructuración del departamento, de la definición de servicios y procesos hasta su puesta en operación.",
        "Apliqué la normativa ISO 9001 a los procesos de calidad del departamento: diagnóstico, procedimientos documentados, hallazgos y acciones correctivas.",
        "Reduje el costo del área en cada renovación: desarrollo interno cuando la herramienta era el problema, cambio de proveedor o de solución cuando la alternativa era más conveniente.",
        "Sustituí procesos en papel y licencias externas por sistemas internos hoy en producción.",
      ],
    },
  },
  {
    company: "Construcciones SB",
    place: { en: "Querétaro", es: "Querétaro" },
    title: { en: "Systems Administrator", es: "Administrador de Sistemas" },
    from: "2025-12",
    to: "2026-05",
    summary: {
      en: "Systems administration for the construction firm: servers, network, perimeter security and support for office and site users.",
      es: "Administración de los sistemas de la constructora: servidores, red, seguridad perimetral y soporte a los usuarios de oficina y obra.",
    },
    responsibilities: {
      en: [
        "Administering Windows and Linux servers in production: configuration, updates and performance monitoring.",
        "Managing accounts, permissions and workstation provisioning with Active Directory across departments.",
        "Configuring Fortinet security appliances: firewall policies, VPN access and network segmentation.",
        "First and second line support for over 200 users, from hardware and software diagnosis to network incidents.",
      ],
      es: [
        "Administración de servidores Windows y Linux en producción: configuración, actualizaciones y monitoreo del rendimiento.",
        "Gestión de cuentas, permisos y aprovisionamiento de estaciones de trabajo con Active Directory en varios departamentos.",
        "Configuración de dispositivos de seguridad Fortinet: políticas de firewall, acceso VPN y segmentación de red.",
        "Soporte de primer y segundo nivel a más de 200 usuarios, del diagnóstico de hardware y software a las incidencias de red.",
      ],
    },
    achievements: {
      en: [
        "Automated Windows and Android device setup with Python and Bash scripts, cutting 50% of the time spent on routine tasks.",
        "Tightened access control and network segmentation following cybersecurity good practices.",
      ],
      es: [
        "Automaticé el alta de equipos Windows y Android con scripts en Python y Bash, y reduje 50% el tiempo de las tareas rutinarias.",
        "Reforcé el control de accesos y la segmentación de red con buenas prácticas de ciberseguridad.",
      ],
    },
  },
  {
    company: "Foton Querétaro",
    place: { en: "Querétaro", es: "Querétaro" },
    title: { en: "IT Specialist", es: "Especialista en TI" },
    from: "2025-07",
    to: "2025-12",
    summary: {
      en: "IT support and internal tooling for the dealership: ERP, data and the equipment every area works on.",
      es: "Soporte de TI y herramientas internas para la distribuidora: ERP, datos y los equipos con los que trabaja cada área.",
    },
    responsibilities: {
      en: [
        "Administering the production, logistics and service modules of the Infor Visual ERP.",
        "Managing user access, network configuration and workstations across departments.",
        "Supporting sales, marketing and after-sales with internal digital tools.",
      ],
      es: [
        "Administración de los módulos de producción, logística y servicio del ERP Infor Visual.",
        "Gestión de accesos de usuario, configuración de red y estaciones de trabajo en varios departamentos.",
        "Apoyo a ventas, marketing y posventa con herramientas digitales internas.",
      ],
    },
    achievements: {
      en: [
        "Automated data synchronisation and report generation with Python scripts and Google API integrations.",
        "Built Excel dashboards and macros for OEE and operational performance analysis.",
        "Improved the accuracy of ERP reporting by putting its module configuration in order.",
      ],
      es: [
        "Automaticé la sincronización de datos y la generación de reportes con scripts en Python e integraciones con APIs de Google.",
        "Construí dashboards y macros de Excel para el análisis de OEE y desempeño operativo.",
        "Mejoré la precisión de los reportes del ERP al ordenar la configuración de sus módulos.",
      ],
    },
  },
  {
    company: "Centro de Abastos Fany",
    place: { en: "Atlacomulco", es: "Atlacomulco" },
    title: { en: "Information Systems Supervisor", es: "Supervisor de Sistemas de Información" },
    from: "2024-01",
    to: "2025-07",
    summary: {
      en: "The information systems behind the daily operation of the wholesale market: network, main server, surveillance and support for every area.",
      es: "Los sistemas de información detrás de la operación diaria del centro de abastos: red, servidor principal, videovigilancia y soporte a todas las áreas.",
    },
    responsibilities: {
      en: [
        "Administering the internal network and the main server, resolving connectivity and performance problems.",
        "Preventive and corrective maintenance of the whole computer fleet.",
        "Running and maintaining the video surveillance system behind operational security.",
        "Technical support for all staff.",
      ],
      es: [
        "Administración de la red interna y del servidor principal, resolviendo problemas de conectividad y rendimiento.",
        "Mantenimiento preventivo y correctivo de todo el parque de equipos de cómputo.",
        "Operación y mantenimiento del sistema de videovigilancia que respalda la seguridad operativa.",
        "Soporte técnico a todo el personal.",
      ],
    },
    achievements: {
      en: [
        "Brought in new technology for the operation, including GPS tracking for the vehicle fleet.",
      ],
      es: [
        "Implementé soluciones nuevas para la operación, entre ellas el rastreo GPS de la flotilla de vehículos.",
      ],
    },
  },
  {
    company: "Mercado Libre",
    place: { en: "Remote", es: "Remoto" },
    title: { en: "Logistics Specialist", es: "Especialista en Logística" },
    from: "2019-12",
    to: "2023-05",
    summary: {
      en: "Online order logistics, remote: carrier coordination, customer service and inventory accuracy.",
      es: "Logística de pedidos en línea, en remoto: coordinación con paqueterías, atención al cliente e inventario.",
    },
    responsibilities: {
      en: [
        "Coordinating online order logistics and the day-to-day operation with the carriers.",
        "Customer service on orders, returns and refunds.",
        "Keeping product listings and inventory accurate so orders processed cleanly.",
      ],
      es: [
        "Coordinación de la logística de pedidos en línea y de la operación diaria con las paqueterías.",
        "Atención al cliente en pedidos, devoluciones y reembolsos.",
        "Listados de producto e inventario al día para que los pedidos se procesaran sin errores.",
      ],
    },
    achievements: {
      en: [
        "Analysed logistics data to improve delivery times and the efficiency of the operation.",
        "Held customer satisfaction high across three years of continuous operation.",
      ],
      es: [
        "Analicé datos logísticos para mejorar los tiempos de entrega y la eficiencia de la operación.",
        "Sostuve niveles altos de satisfacción del cliente durante tres años de operación continua.",
      ],
    },
  },
];

interface Education {
  title: Localized;
  institution: string;
  status: Localized;
}

/** Spoken languages, shown beside the education list. */
export const languages: Localized = { en: "Spanish (native) · English (advanced)", es: "Español (nativo) · Inglés (avanzado)" };

export const education: Education[] = [
  { title: { en: "Computer Engineering", es: "Ingeniería en Computación" }, institution: "Universidad Autónoma del Estado de México", status: { en: "Degree completion in progress", es: "Titulación en proceso" } },
  { title: { en: "Google Cybersecurity Certificate", es: "Google Cybersecurity Certificate" }, institution: "Google", status: { en: "In progress", es: "En curso" } },
  { title: { en: "Google IT Support", es: "Google IT Support" }, institution: "Google", status: { en: "In progress", es: "En curso" } },
  { title: { en: "Git & GitHub · Object-Oriented Programming", es: "Git y GitHub · Programación Orientada a Objetos" }, institution: "Platzi", status: { en: "Courses", es: "Cursos" } },
];
