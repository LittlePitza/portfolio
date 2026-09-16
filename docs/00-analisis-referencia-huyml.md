# Análisis de referencia: huyml.co (Huy Phan)

Fecha: 2026-09-16. Analizado en navegador (desktop 800×450 y móvil 375×812).

## Qué es técnicamente

| Aspecto | Hallazgo |
|---|---|
| Plataforma | Framer (meta generator `Framer`). No hay GSAP, Lenis, Three.js ni framework expuesto. |
| Animación | 2 `<canvas>`: el personaje ilustrado del preloader es una animación **Rive** (créditos: "Development & Rive: Chien Pham"). |
| Tipografías | **BT Glyphius** (serif display de alto contraste, el "HUY PHAN" rojo) + **BT Grotesk** (sans para UI y cuerpo) + F37 Bolton. Las tres son de pago. |
| Color | Fondo gris claro `#ECECEC`, texto negro `#1E1E1E`, acento rojo coral (nombre), negro puro para el telón del loader y overlays. Casi monocromo: el color lo ponen las imágenes de proyectos. |
| Créditos | Ilustración, desarrollo, copy y fuentes son de terceros: es un trabajo de equipo, no de una persona. |

## Estructura y experiencia

1. **Preloader narrativo.** Pantalla negra; un personaje ilustrado (caricatura del autor) "empuja" el telón negro hacia la derecha y revela el nombre en serif rojo gigante. Es el gesto más memorable del sitio.
2. **Marco fijo (chrome).** Logo + avatar ilustrado arriba-izquierda; menú `WORK / ABOUT / PLAYGROUND / CONTACT`; toggle de audio; reloj "Working globally · HCMC, hh:mm"; email "For inquiries"; "Scroll" abajo-izquierda; showreel abajo-derecha.
3. **Carrusel de trabajos con scroll secuestrado.** 19 proyectos, contador `01 /19`. Cada slide: columna izquierda con metadatos (`Role`, `Launch`, `Recognition`), imagen central, columna derecha con una "rueda" vertical de proyectos donde el activo está nítido y los demás desvanecidos. Detrás, un abanico de imágenes inclinadas (arriba-derecha y abajo-izquierda) que rota con cada slide. Swatches de color por proyecto.
4. **About como overlay.** Pantalla negra con "ABOUT" en serif; luego datos personales con humor ("Plant daddy", "3 cats call him dad"), premios con conteos, capabilities, proceso P1–P7 y "Trusted by".
5. **Contact como overlay.** "COME SAY HI", email y enlaces agrupados por intención ("Hear me yapping about design → YouTube"). Créditos al pie.
6. **Móvil.** Misma secuencia de loader; el nombre gigante se corta a propósito.

## Lo que lo hace funcionar (y hay que conservar)

- **Una sola idea fuerte:** el personaje que abre el telón. Todo lo demás es sobrio.
- **Tipografía como identidad:** serif display enorme + grotesk pequeña y funcional. El contraste de escala hace el diseño.
- **Metadatos en columnas** al estilo ficha técnica: se lee como un catálogo, no como una landing.
- **Personalidad en el copy:** el sitio suena a persona, no a agencia.
- **Fondo casi vacío:** las imágenes de proyectos aportan el color.

## Debilidades que podemos superar

- Todo vive en una sola URL: About, Contact y cada proyecto no son enlazables ni indexables.
- Scroll secuestrado sin respeto a `prefers-reduced-motion`; en móvil se vuelve confuso.
- Carga pesada (Framer + Rive + 19 sets de imágenes).
- Sin modo oscuro ni idioma alternativo.

## Traducción a un portafolio de Luis Hernández

Luis es desarrollador full-stack y responsable de TI, no diseñador visual. Sus "trabajos" son sistemas en producción con cifras verificables. El equivalente de "Recognition" son **números**: pruebas, migraciones, SLA, disponibilidad.

| Elemento de huyml | Equivalente propuesto |
|---|---|
| Personaje que empuja el telón | Un gesto de apertura propio (personaje ilustrado, o un reveal tipográfico/terminal). Decisión pendiente. |
| `Role / Launch / Recognition` | `Role / Stack / Launch / Numbers` (p. ej. "160 tests · 19 RLS policies · 5-stage CI"). |
| 19 proyectos | 6 proyectos: TI Hub, Asistencia, Portal de mantenimiento, Marketplace B2B, MeetScribe, Password Vault. |
| Premios | KPIs operativos: 93% SLA, 100% disponibilidad, -28% gasto. |
| Trusted by | Experiencia: PIMSA, Construcciones SB, Foton, Centro de Abastos Fany, Mercado Libre. |
| Playground | Open source y experimentos: MeetScribe, Password Vault, scripts. |
| Showreel | Descarga de CV (ES/EN, ya existen los PDF). |
| Reloj HCMC | Reloj Querétaro (UTC-6). |

## Stack propuesto

- **Next.js 16 + React 19 + TypeScript estricto + Tailwind v4.** Es el stack que Luis domina y que aparece en su CV: el repo del portafolio es en sí una pieza de portafolio.
- **GSAP + ScrollTrigger + SplitText** (gratuitos desde 2025) para el carrusel, el reveal tipográfico y las transiciones. **Lenis** para scroll suave.
- **Rive** (`@rive-app/react-canvas`) solo si se decide tener personaje ilustrado. Alternativa: Lottie o SVG + GSAP.
- **Contenido en MDX** dentro del repo (un archivo por proyecto). Sin base de datos: no hay nada que justifique Supabase en v1.
- **Vercel** para despliegue, previews por rama y Analytics.
- **Rutas reales** para cada proyecto (`/work/ti-hub`), About y Contact, con la portada inmersiva. SEO con JSON-LD `Person` y OG images generadas.
- **i18n ES/EN** con `next-intl` (segmento `/es` y `/en`).
- **Reduced-motion**: sin scroll secuestrado; el carrusel se vuelve lista vertical.
- **Tipografías libres** para reemplazar las de pago: display serif (Instrument Serif, Fraunces o Bricolage Grotesque en display) + sans (Geist, Inter Tight o Manrope).

## Opcionales para v2 (aquí sí cabe Supabase)

- Formulario de contacto con Resend o Microsoft Graph (experiencia ya demostrada).
- Guestbook / reacciones por proyecto (Supabase).
- Panel privado para editar proyectos sin redeploy (Supabase + RLS).

## Decisiones pendientes del autor

1. Identidad: nombre en portada ("LUIS HERNÁNDEZ", "LALO", "LittlePitza") y si habrá personaje ilustrado.
2. Idioma por defecto (ES con toggle a EN, o EN por defecto como en LinkedIn).
3. Enfoque: Dev-first (carrusel de sistemas) o TI-manager-first (KPIs y gestión). Recomendación: Dev-first con About que cuente la parte de gestión.
4. Capturas de pantalla de los sistemas internos: disponibilidad y anonimización de datos de PIMSA.
5. Dominio propio.

---

## Decisiones tomadas (2026-09-16)

| Decisión | Elección |
|---|---|
| Identidad de portada | Personaje ilustrado que empuja el telón (por ahora un SVG placeholder en `src/components/preloader/Character.tsx`; Rive se conecta con `site.riveCharacter`). |
| Nombre en portada | LUIS HERNÁNDEZ |
| Idioma por defecto | Inglés, con toggle a español. Rutas `/en` y `/es`; `src/proxy.ts` redirige según cookie o `Accept-Language`. |
| Capturas | Luis capturará y anonimizará las de los sistemas internos. Van en `public/covers/` y se enlazan con `cover` en `src/content/projects.ts`. Mientras no existan, `Cover.tsx` genera una ventana de app con las cifras reales. |

## Estado de la v1 (misma fecha)

Hecho y verificado con `next build` (23 páginas estáticas):

- Preloader con personaje y telón (una vez por sesión, se salta con `prefers-reduced-motion`).
- Hero con nombre gigante en Instrument Serif, tagline y reveal con GSAP.
- Carrusel de 6 proyectos anclado por scroll (desktop) con columnas Role / Stack / Launch / Numbers, rueda vertical, contador y abanico de portadas; lista vertical en móvil y con reduced-motion.
- Páginas About, Contact y una por proyecto (`/work/[slug]`) con navegación anterior/siguiente.
- Marco fijo con reloj de Querétaro, correo, CV descargable (ES/EN) y toggle de idioma, en `mix-blend-difference` para leerse sobre negro.
- SEO: metadata por idioma, `alternates`, JSON-LD Person, sitemap y robots.

## Segunda iteración (2026-09-16, tarde)

- Dominio propio: lhernandez.dev, registrado en Vercel y asignado al proyecto.
- Sistema de logos: monograma geométrico LH en `icon.svg`, Apple icon y tarjetas OpenGraph por idioma generadas con `next/og`.
- Toque brutalista: bordes duros, sombras desplazadas, botones mono, sellos rotados, rejilla de ingeniería, números huecos.
- Navegación más intuitiva: llamadas a la acción en el hero, flecha en la sección actual, desenfoque de los otros ítems del menú, botones, teclado y barra de progreso en el carrusel, puntos de navegación por color.
- Detalles tomados de huyml: transición de página con panel naranja inclinado y título hueco, Contacto como tarjetas flotantes con créditos, retrato ilustrado de Luis en About cuya cabeza se abre con objetos y sus historias, título de pestaña que cambia al salir, cursor personalizado, contador en el preloader.

## Pendientes

1. Ilustración definitiva del personaje (y opcionalmente animación Rive).
2. Capturas anonimizadas de TI Hub, Asistencia, Mantenimiento y Marketplace.
3. Completar los dos `TODO` personales en `src/content/profile.ts` (datos tipo "plant daddy").
4. Playground / open source como sección propia, si se quiere replicar ese menú de huyml.
