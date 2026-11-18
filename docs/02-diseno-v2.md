# Diseño v2: lhernandez.dev

Fecha: 2026-11-17. Rama `feat/v2-redesign`. Continúa a `01-auditoria-v2.md` (qué está mal y por qué) y concreta el alcance C, el híbrido: Home, About y Contact como pantallas compuestas de un viewport; fichas de proyecto e índice como páginas con scroll sobre el mismo sistema.

Este documento es la especificación de construcción. Quien construya no debería tener que preguntar nada: cada valor, texto y comportamiento está aquí. La maqueta navegable está en `docs/v2-mock/` (abrir `index.html`, o `node docs/v2-mock/serve.mjs` y `http://127.0.0.1:4173`); enseña la composición y el movimiento de Home y About, no es código de producción, y sus portadas son esquemas en lugar de las reales. Donde la maqueta y este documento difieran, manda el documento.

## 1. Intención

**Una frase:** el sitio de alguien que construye los sistemas que opera, y que opera este sitio como uno más.

Tres reglas gobiernan todo lo demás:

1. **Pocas decisiones, repetidas.** Seis tallas, una retícula, una curva, tres duraciones, un gesto de entrada. Si un componente necesita un valor que no está en la tabla de tokens, el componente está mal, no la tabla.
2. **Dos escalas, nada en medio.** Lo diminuto (12 px, toda la interfaz) y lo enorme (el nombre, una cifra). El color lo ponen las portadas y el personaje; el resto es papel, tinta y un gris.
3. **Un gesto memorable por pantalla.** Home: la rueda cambia de proyecto. About: la cabeza se abre. Contact: las tarjetas. Ficha: ninguno, ahí se lee.

### Las dos ideas que lo hacen de Luis y no una copia tranquila de la referencia

**A. La cifra es la protagonista.** En huyml.co el elemento gigante es un contador (`01 /19`). Aquí es la evidencia: la cifra principal del proyecto activo (`160` pruebas, `345` aserciones SQL, `0` bytes que salen del equipo) a talla de exhibición, y cambia rodando carácter por carácter cuando cambia el proyecto. Lo que en un diseñador son premios, en Luis son números verificables; por eso ocupan el lugar de honor en Home, encabezan cada ficha y son las dos cifras grandes de About.

**B. El operador.** El personaje ya no es solo el preloader: es quien opera el sitio. Empuja el telón negro al abrir (el gran momento, se conserva), empuja una línea fina de carga en el telón de papel entre páginas (el eco tranquilo de ese momento), y en About es su cabeza la que se abre. El sitio se trata a sí mismo como un sistema en producción: sello de build real (commit y fecha) en los créditos, la ruta de destino escrita en el telón, el 404 redactado como reporte de incidente y el título de pestaña que ya dice "Los sistemas siguen corriendo".

## 2. Qué cambia respecto a la base propuesta en la auditoría

La base de `01-auditoria-v2.md` se adopta casi entera. Cambios y motivo:

| Tema | Auditoría | v2 | Por qué |
|---|---|---|---|
| Acento | `#FF4A1C` | `#F04010` | El actual da 2.84:1 sobre el fondo y no llega al mínimo AA de texto grande (3:1). El nuevo da 3.26:1 y a simple vista es el mismo naranja. Regla nueva: el acento nunca se usa en texto menor de 24 px. |
| Dónde vive el acento | Nombre y un estado activo | Nombre, la declaración de About, foco de teclado y selección de texto | El estado activo se marca con tinta y una flecha, no con color. El acento queda para lo que dice "Luis" y para accesibilidad. |
| Escala | 6 tallas fijas | 6 roles, cada uno con valor de teléfono y de escritorio | 96 px no cabe en 390 px. Sigue habiendo seis nombres y un solo punto de quiebre. |
| Retícula | 8 columnas, margen 20 | 8 columnas con separación de 20 px (4 en teléfono) | Una rejilla estándar (`grid-cols-8 gap-x-5`) da las mismas líneas y cualquier persona la mantiene sin calcular. |
| Punto de quiebre | Uno | Uno, con dos condiciones: ancho ≥ 1024 px **y** alto ≥ 640 px | Una pantalla compuesta que no cabe de alto es justo el fallo crítico actual (el nombre cortado). Si no cabe, la página pasa a modo apilado con scroll. |
| Marco con scroll | Se oculta al bajar | En páginas con scroll el marco completo va en el flujo, arriba; al subir aparece una barra compacta de 56 px | El menú de cuatro líneas mide ~150 px; como barra fija taparía media pantalla. La barra compacta es la misma que usa el teléfono: un componente, dos usos. |
| Carrusel | Scroll anclado (pin) | Pasos discretos: la rueda, el teclado o el dedo avanzan un proyecto | El documento de Home ya no hace scroll, así que no hay nada que anclar. Se elimina `ScrollTrigger`, la página de 7 954 px y la sincronización con el scroll suave. |
| Entrada | Una primitiva compartida desde un módulo | La primitiva es CSS puro; GSAP queda solo para coreografías con estado | Las entradas corren antes de hidratar y sin JavaScript. Dos motores, pero con frontera clara y los mismos tokens. |
| Transición de página | Sin decidir | Telón de papel (claro) con el título de destino, la ruta y el personaje empujando una línea | Ver sección 7.3. Nunca hay pantalla negra ni vacía. |
| Contact | Pantalla compuesta | Solo la ruta `/contact`; desaparece la capa `ContactOverlay` | Dos mecanismos para lo mismo. La transición es lo bastante corta para no necesitar atajo. |
| Playground | Índice en columnas | Se muda a `/work` (índice) con redirección permanente desde `/playground` | `/work` y `/work/[slug]` es la jerarquía natural. En el menú se llama "Índice". |
| Scroll suave | Sin decidir | Se retira Lenis | Ver sección 8. |
| Cursor propio | Sin decidir | Se retira | Es adorno sobre todo el sitio; el cursor nativo es parte de la calma. El efecto de desenfocar a los vecinos al pasar el cursor lo sustituye como detalle de puntero. |

## 3. Tokens

Todos viven en `src/app/globals.css` dentro de `@theme static` (así Tailwind emite cada variable aunque ninguna utilidad la use, y el CSS de los módulos y el JS pueden leerla) y son la única fuente. Los valores de movimiento se repiten como constantes en `src/lib/motion.ts` con un comentario que apunta aquí.

### 3.1 Color

| Token | Valor | Uso |
|---|---|---|
| `--color-bg` | `#ECECE9` | Fondo de todo el sitio |
| `--color-paper` | `#F6F6F3` | Telón de página, tarjetas de Contact, tarjeta de objeto en About |
| `--color-ink` | `#141414` | Texto, valores, telón del preloader, marca LH |
| `--color-muted` | `#65655F` | Etiquetas y texto secundario (4.96:1 sobre fondo, 5.42:1 sobre papel) |
| `--color-line` | `rgb(20 20 20 / 0.14)` | Líneas finas de 1 px |
| `--color-accent` | `#F04010` | Nombre, declaración de About, foco, `::selection` |

Reglas: sin sombras ni degradados fuera de las portadas. Los colores de proyecto (`project.color`) solo existen dentro de su portada. Tema claro único; no hay modo oscuro en v2 (las portadas y el personaje están dibujados para papel).

### 3.2 Tipografía

Familias: **Instrument Serif 400** (solo normal; se deja de cargar la cursiva) para títulos, nombre y cifras; **Geist 400** para toda la interfaz y el cuerpo; **Geist Mono** solo dentro de las portadas, con `preload: false`.

| Rol | Clase | Teléfono | Escritorio | Familia | Notas |
|---|---|---|---|---|---|
| Interfaz | `text-ui` | 12 / 16 | 12 / 16 | Geist | Etiquetas en `muted`, valores en `ink`. Minúsculas, sin tracking. |
| Cuerpo | `text-body` | 16 / 26 | 16 / 26 | Geist | Medida máxima 68 caracteres. |
| Entradilla | `text-lead` | 24 / 32 | 24 / 32 | Geist | Tracking −0.01em. Única talla de Geist que admite acento. |
| Encabezado | `text-heading` | 32 / 36 | 48 / 52 | Serif | Tracking −0.01em. Menú a 24 / 28 usa `text-lead` en serif (única excepción, ver 5). |
| Título de página | `text-title` | 56 / 56 | 96 / 92 | Serif | Tracking −0.02em. Uno por página. |
| Exhibición | `text-display` | `19.5vw` | `min(18.4vw, 30svh)` | Serif | Mayúsculas, interlineado 0.82, tracking −0.02em. El nombre. La cifra gigante usa `text-figure` = `min(15vw, 26svh)` (teléfono: `34vw`). |

Formato (tamaño / interlineado en px). Mayúsculas solo en exhibición; títulos y encabezados en tipo oración ("Sobre mí", no "SOBRE MÍ"). Cifras tabulares (`tabular-nums`) en reloj, contador y tablas. Un solo peso de Geist: el énfasis se hace con `ink` frente a `muted`.

El tamaño de exhibición está calculado para que "HERNÁNDEZ" quepa siempre. Medido en la maqueta, la palabra en Instrument Serif mide ~4.3 em de ancho, así que `18.4vw` nunca llega al margen; lo que manda es el alto, y `30svh` garantiza que las dos líneas, el marco y el texto de la portada quepan (a 1440 × 800 el nombre queda en 240 px; a 1366 × 650, en 195 px). Comprobar con el criterio de aceptación H1.

### 3.3 Espacio, radio y capas

| Token | Valor | Uso |
|---|---|---|
| `--margin` | 16 px teléfono, 20 px escritorio | Margen lateral y distancia del marco a los bordes |
| `--gap` | 20 px (16 teléfono) | Separación de columnas |
| Ritmo vertical | 4, 8, 16, 32, 48, 96, 160 px | Solo estos. 8 entre etiqueta y valor, 16 entre grupos, 48 entre bloques (32 teléfono), 160 entre secciones de una ficha (96 teléfono) |
| `--radius` | 8 px | Tarjetas de Contact y de objeto. Las portadas no llevan radio. |
| `--z-content` | 0 | Contenido |
| `--z-chrome` | 10 | Marco y barra compacta |
| `--z-curtain` | 30 | Telón de página |
| `--z-preloader` | 40 | Preloader |

Las capas (menú, detalle de About) son `<dialog>` abiertos con `showModal()`: viven en la capa superior del navegador y no necesitan `z-index`. No se escribe ningún otro valor de `z-index` en el proyecto.

### 3.4 Movimiento

| Token | Valor | Uso |
|---|---|---|
| `--ease` | `cubic-bezier(0.22, 1, 0.36, 1)` | Todo |
| `--dur-fast` | 200 ms | Hover, salida de texto, cambios de color y desenfoque de vecinos |
| `--dur-base` | 450 ms | Entrada de texto, capas, barra compacta, subida y bajada del telón |
| `--dur-slow` | 900 ms | Viaje de portadas en el carrusel, beats del preloader |
| `--stagger` | 60 ms | Escalonado entre elementos hermanos |
| `--blur` | 8 px | Desenfoque de entrada y salida |
| `--blur-rest` | 2 px | Desenfoque de los vecinos no activos |

## 4. Retícula y modos de página

- Contenedor único: ancho completo, `padding-inline: var(--margin)`, 8 columnas con `column-gap: var(--gap)`. En teléfono, 4 columnas. Ancho máximo del contenido 1920 px, centrado.
- A 1440 px cada columna mide 157.5 px; las líneas caen en 20, 197.5, 375, 552.5, 730, 907.5, 1085 y 1262.5. Todo elemento empieza en una de ellas.
- **Punto de quiebre único**, variante `stage:` definida una vez en `globals.css`: `(min-width: 64rem) and (min-height: 40rem)`. El alto mínimo sale de medir la maqueta: a 1366 × 650 (un portátil de 768 px con las barras del navegador) el proyecto con más metadatos todavía cabe sin solaparse. No se usan `sm:`, `md:`, `lg:` ni `xl:` para layout. (Comprobar la sintaxis de `@custom-variant` en la documentación de Tailwind v4 antes de escribirla.)

Dos modos de página, cada uno con su layout de grupo de rutas (`StageShell` y `ScrollShell`):

| Modo | Rutas | Comportamiento |
|---|---|---|
| **Pantalla** (`(stage)`) | Home, About, Contact, 404 | Con `stage:` activo: contenedor de `100svh`, sin scroll de documento, marco arriba y abajo dentro del contenedor. Sin `stage:` (teléfono o ventana baja): la misma página se apila y hace scroll, con barra compacta. |
| **Lectura** (`(scroll)`) | `/work`, `/work/[slug]` | Siempre con scroll nativo. Marco completo en el flujo (escritorio) y barra compacta que aparece al subir. |

Una página de Pantalla compuesta para caber en un viewport (Home, About, Contact, 404) se marca con el atributo `data-fit`. Con `stage:` activo y `html[data-js]`, `globals.css` fija el contenedor del `StageShell` a `100svh` con `overflow: clip` y hace que el elemento `data-fit` ocupe exactamente el espacio entre las dos filas del marco. Sin JavaScript, o sin `stage:`, la misma página se apila y hace scroll.

## 5. Marco

Un solo conjunto de piezas, colocadas por el layout del modo. Fondo sólido siempre; se elimina `mix-blend-difference`.

### 5.1 Marco completo (escritorio)

```
col 1            col 2-3          col 5-6                    col 7-8 (alineado a la derecha)
[LH] Luis        Menú             Trabajando desde                              Correo
     Hernández   → Trabajo        Querétaro, MX · 17:38      lhernandez025cz@gmail.com
     Full-stack    Sobre mí
     y TI          Índice
                   Contacto

…contenido de la página…

col 1-2                                                       col 7-8 (derecha)
(ranura de pista de la página)                                       CV ↓    EN / ES
```

- Fila superior a `--margin` del borde; fila inferior a `--margin` del borde inferior.
- **Marca**: cuadrado de 28 px en `ink` con "LH" en `bg` (deja de ser naranja; el favicon no cambia). Enlaza a Home en su portada.
- **Menú**: etiqueta "Menú" en `text-ui muted`; cuatro enlaces en serif 24 / 28. La página actual lleva `→` delante y `aria-current="page"`. Al pasar el cursor por uno, los otros tres pasan a `opacity .45` y `blur(2px)` en `--dur-fast`. Es el detalle de puntero del sitio y se repite en la lista de nombres de Home, las filas del índice y las tarjetas de Contact.
- **Reloj**: hora de `America/Mexico_City`, formato de 24 h, cifras tabulares; se actualiza cada minuto.
- **Correo**: botón que copia la dirección. Al copiar, la etiqueta "Correo" cambia a "Copiado" durante 2 s y se anuncia por `aria-live="polite"`.
- **Ranura de pista** (abajo a la izquierda): la decide cada página. Home: "Desliza ↓" (o "Usa las flechas" con movimiento reducido). About y Contact: "© 2026". Ficha: no existe, va en el pie.
- **CV**: descarga el PDF del idioma activo. **Idioma**: `EN / ES`, el activo en `ink`, el otro en `muted`.

En modo **Pantalla** las dos filas se posicionan dentro del contenedor de `100svh`. En modo **Lectura** la fila superior va en el flujo al inicio del documento y la inferior se integra en el pie.

### 5.2 Barra compacta

56 px de alto, fija arriba, fondo `bg`, línea fina inferior. Izquierda: marca + "Luis Hernández". Derecha: botón "Menú" (área táctil 44 px).

- Teléfono y modo apilado: es el único marco. Se oculta al bajar (`translateY(-100%)`, `--dur-base`) y vuelve al subir; siempre visible en el tope de la página.
- Escritorio en modo Lectura: oculta mientras el marco completo esté en pantalla; aparece al subir una vez que se pasó de él.
- Nunca aparece en modo Pantalla con `stage:` activo.

### 5.3 Capa de menú

`<dialog>` a pantalla completa, fondo `bg`. Los cuatro enlaces en `text-title`, apilados a la izquierda, con el mismo desenfoque de vecinos. Debajo, en `text-ui`: reloj, correo, CV, idioma. Botón "Cerrar" arriba a la derecha. Entra con la primitiva de entrada (7.1), escalonando los enlaces.

## 6. Pantallas

En cada pantalla: trabajos que debe resolver (por prioridad), composición de escritorio, composición de teléfono, estados.

### 6.1 Home

**Trabajos:** (1) decir quién es y qué hace en cinco segundos; (2) enseñar que hay sistemas reales con cifras; (3) llevar a una ficha; (4) dejar claro cómo moverse.

Home tiene diez posiciones: la **portada** (posición 0) y los nueve proyectos (1 a 9). La rueda, las flechas, `Re Pág`/`Av Pág`, `Inicio`/`Fin` o un deslizamiento vertical avanzan o retroceden una posición.

**Posición 0, portada (1440 × 800):**

```
[marco superior]

 Desarrollador full-stack y responsable de TI


 L U I S                        Construyo los sistemas
 (exhibición, acento)           que opero.                      (encabezado, col 5-8)
                                La mayoría de los responsables de TI compran sus
                                herramientas. Yo escribo las que usa mi departamento…
                                Ver el trabajo ↓                (cuerpo muted, máx. 46 car.)
 H E R N Á N D E Z
 (exhibición, acento, ancho completo)

 Desliza ↓                                                              CV ↓   EN / ES
```

- El nombre se ancla abajo a la izquierda, 48 px por encima de la fila inferior del marco. Es un `<h1>` con las dos líneas.
- El bloque de texto ocupa las columnas 5 a 8 y su base se alinea con la base de "LUIS"; crece hacia arriba.
- "Ver el trabajo ↓" avanza a la posición 1.
- Ninguna portada es visible en la posición 0.

**Posiciones 1 a 9, trabajo:**

```
[marco superior]            ╱prev╲  (asoma desde arriba, col 3-4, −7°, escala .8)

 Rol      Autor único                                            Sistema interno
          Arquitectura                                           Attendance      (.35, blur)
 Stack    Next.js 15            ┌──────────────────┐
          React 19              │                  │             Plataforma interna
          TypeScript            │  portada activa  │             TI Hub          (activo)
          Supabase              │  col 4-5 · 4:3   │             —
 Lanz.    2026                  │                  │             Mesa de ayuda con motor
 Estado   En producción         └──────────────────┘             de SLA, inventario…
                                 Ver caso de estudio →
                                                                 Plataforma interna
 01 / 09 · Trabajo seleccionado                                  Maintenance portal (.35, blur)
 1 6 0   pruebas
 (cifra gigante, col 1-3)        19 políticas RLS
                                 23 rutas     ╲next╱ (asoma desde abajo, col 6-7, +7°, escala .8)
                                 5 etapas de CI
 Desliza ↓                                                              CV ↓   EN / ES
```

- **Portada activa**: columnas 4 y 5 (335 px a 1440, el 23 % del ancho), proporción 4:3, centrada en vertical en el lienzo, sin inclinación. Toda ella es un enlace a la ficha. Conserva su reacción al cursor (los fragmentos se levantan).
- **Vecinas**: solo dos visibles, lejos de todo texto. La anterior asoma ~70 px por el borde superior con centro en la línea de la columna 4; la siguiente asoma ~70 px por el borde inferior con centro en la línea de la columna 6. El resto no se pinta (`content-visibility: hidden`), lo que además evita descargar las tipografías de portadas que no se ven.
- **Metadatos** (columnas 1 y 2, desde 200 px del borde superior, no centrados: abajo vive la cifra): componente `MetaList`, rejilla de `5.5rem 1fr`, etiqueta `muted`, valores `ink`, uno por línea, 16 px entre grupos. Grupos: Rol, Stack, Lanz., Estado.
- **Cifra gigante** (columnas 1 a 3, anclada a 56 px del borde inferior): `numbers[0].value` en `text-figure`, serif, `ink`. Pegada a su derecha, alineada arriba, su etiqueta en `text-ui`. Encima, "01 / 09 · Trabajo seleccionado" en `text-ui muted`. Si el valor es largo (`100%`, `2024`) el tamaño se reduce para caber en las tres columnas: `font-size: min(var(--text-figure), calc((3 * var(--col) + 2 * var(--gap)) / (var(--chars) * 0.5)))`, con `--chars` puesto en línea desde el servidor.
- **Resto de cifras** (`numbers[1…]`): lista en `text-ui` en la línea de la columna 4, con la base alineada a la base de la cifra gigante. Valor en `ink` tabular, etiqueta en `muted`.
- **Enlace a la ficha**: "Ver caso de estudio →" en `text-ui`, 12 px por debajo de la portada, en la línea de la columna 4.
- **Lista de nombres** (columnas 7 y 8): `<nav aria-label="Proyectos">` con nueve botones. Cada uno: categoría (`text-ui muted`) y nombre (serif 24 / 28). El activo además muestra una raya y el resumen (`text-ui`, máximo 4 líneas) y lleva `aria-current="true"`. Los demás a `opacity .35` y `blur(2px)`; los que distan más de dos posiciones, `opacity 0`. La lista se desplaza en vertical para que el activo quede centrado. Clic en un nombre: va a ese proyecto.
- Se eliminan puntos de color, flechas, barra de progreso, texto de ayuda largo y el enlace "every project".

**Memoria de posición:** la última posición se guarda en `sessionStorage` (`home:position`). Al volver de una ficha se abre en ese proyecto. El enlace "Trabajo" del menú abre en `max(1, guardada)`; la marca LH abre en 0.

**Teléfono y modo apilado:** página con scroll nativo, sin secuestro de gestos.

```
[barra compacta]
Desarrollador full-stack y responsable de TI
LUIS
HERNÁNDEZ            (exhibición 19.5vw, acento)
Construyo los sistemas que opero.     (encabezado)
La mayoría de los responsables…       (cuerpo muted)
───────────────────────────────
01 / 09 · Plataforma interna
┌──────────────────────────┐
│ portada, ancho completo  │
└──────────────────────────┘
TI Hub                          (encabezado)
160  pruebas                    (cifra 34vw + etiqueta)
Mesa de ayuda con motor de SLA… (cuerpo)
Rol  …   Stack  …               (MetaList en 2 columnas)
Ver caso de estudio →
(96 px)
02 / 09 · …
```

Es el mismo DOM que el escritorio (una lista ordenada de nueve artículos); solo cambia el CSS. Cada artículo entra con la primitiva al llegar al viewport.

**Estados:** sin JavaScript, el modo Pantalla no se activa (la clase que lo habilita la pone el script) y Home se muestra apilado y completo. Con movimiento reducido, el modo Pantalla funciona igual pero los cambios son un fundido de 150 ms sin viaje ni desenfoque.

### 6.2 About

**Trabajos:** (1) quién es, en una declaración; (2) qué sabe hacer y dónde lo ha hecho, de un vistazo; (3) el detalle para quien lo quiera; (4) que se le recuerde como persona.

**Escritorio (1440 × 800), un viewport:**

```
[marco superior]

 Sobre mí                                         La mayoría de los responsables de TI compran
 (título, col 1-3)                                sus herramientas. Yo escribo las que usa mi
                              ┌─────────┐         departamento y respondo por su disponibilidad
                              │         │         en el mismo reporte.   (entradilla, acento, col 6-8)
 5                            │ retrato │
 sistemas en producción,      │ col 4-5 │                                         1,050
 autor único                  │         │                  pruebas y aserciones automatizadas
 (cifra, col 1-2)             └─────────┘                                 (cifra, col 7-8, derecha)
                        ¿Qué pasa dentro de mi cabeza?

 Datos                 Capacidades +           Trayectoria +            Cómo construyo +
 En Querétaro, México  Desarrollo de software  PIMSA          2026–hoy  P1 Diagnosticar por escrito
 Desarrollo de…        Bases de datos          Construcciones SB 2025–26 P2 Reglas en la base de datos
 Juegos de mesa,…      Integraciones y…        Foton Querétaro   2025    P3 Pruebas en CI
 Pizza, café y…        Infraestructura y…      Centro de Abastos… 2024–25 P4 Entregar a usuarios reales
                       Seguridad               Mercado Libre  2019–23   P5 Reportar los KPIs
                       Proyectos y gestión…                             P6 Iterar
 © 2026                                                                          CV ↓   EN / ES
```

- **Cuatro listas** ancladas abajo, una por par de columnas, en `text-ui`: encabezado `muted`, filas `ink`. Tres encabezados son botones con `+` que abren su capa.
- **Dos cifras** en serif a `min(11vw, 20svh)`, con su etiqueta en `text-ui muted`. Salen de un dato nuevo en `src/content/profile.ts` (`figures`), con un comentario que diga de dónde sale cada una: `5` = proyectos cuyo estado es producción o en venta; `1,050` = 160 + 329 + 216 pruebas + 345 aserciones SQL de `projects.ts`.
- **Retrato** (`Head`, se conserva tal cual): columnas 4 y 5, alto `min(40svh, 370px)`. Sigue respirando, parpadeando y mirando al cursor.
- **Declaración**: es `about.statement` del diccionario, en `text-lead` y acento. Es más corta que `hero.sub` para que a 1024 × 640 no llegue a la cifra de la derecha.

**El gesto: la cabeza se abre.** Clic, toque o `Enter` en el retrato levanta la tapa y los siete objetos de `head.ts` flotan alrededor dentro de las columnas 3 a 6. Mientras está abierta, título, declaración, cifras y listas pasan a `opacity .25` y `blur(8px)` para que solo se vea la cabeza. Cada objeto es un botón; al elegir uno aparece su tarjeta (fondo `paper`, línea fina, radio 8 px, sin sombra, giro de −2°) con título, historia y firma. `Escape` o un segundo clic en la cabeza cierra todo y devuelve el foco al retrato. Se conserva la lógica de `InsideHead`; cambia solo el estilo de la tarjeta y se añade el desenfoque del resto.

**Capas de detalle** (componente `Layer`, un `<dialog>` a pantalla completa con scroll propio): título en `text-title` a la izquierda, "Cerrar" a la derecha, contenido en la retícula.

| Capa | Contenido | Composición |
|---|---|---|
| Capacidades | Las 6 capacidades con su descripción y grupos | 3 columnas de 2 capacidades (col 1-2, 4-5, 7-8). Título en `text-lead`, descripción en `text-body muted`, grupos como `MetaList`. |
| Trayectoria | Los 5 puestos completos, formación e idiomas | Una fila por puesto: columnas 1-2 fechas y lugar (`text-ui`), 3-8 empresa y cargo (`text-heading` y `text-lead`), resumen, responsabilidades y logros en dos columnas de cuerpo. Formación al final como `MetaList`. |
| Cómo construyo | Los 6 pasos | Seis filas: `P1` en serif `text-heading muted` (col 1), título en `text-heading` (col 2-5), texto en `text-body` (col 6-8). |

Cada capa tiene ancla en el idioma de la página, tomada de `about.anchors` del diccionario: `#capacidades`, `#trayectoria`, `#proceso` en `/es` y `#capabilities`, `#journey`, `#process` en `/en`. Abrir la URL con el ancla abre la capa, y abrirla actualiza el ancla. Todo el contenido está en el HTML del servidor.

**Teléfono:** scroll. Orden: título, declaración, retrato (mismo gesto; los objetos flotan sobre el retrato y la tarjeta ocupa el ancho), las dos cifras lado a lado, las cuatro listas en rejilla de 2 × 2. Las capas son a pantalla completa.

### 6.3 Contact

**Trabajos:** (1) copiar o abrir el correo; (2) llegar a GitHub, LinkedIn y el CV; (3) dejar una sonrisa.

**Escritorio, un viewport:**

```
[marco superior]

 Saluda                                        ┌────────────┐
 (título, col 1-3)                             │ GitHub     │ ┌────────────┐
                                               │ Donde vive │ │ LinkedIn   │
                                               │ el código  │ │ Carrera y… │
                                               └────────────┘ └────────────┘
                                                  ┌────────────┐ ┌────────────┐
 Escríbeme                                        │ CV         │ │ Créditos   │
 lhernandez025cz@gmail.com                        │ ES ↓  EN ↓ │ │ build a1b2 │
 (encabezado serif, col 1-4, botón: copia)        └────────────┘ └────[pers.]─┘
 Copiar correo · Abrir en tu correo →
 © 2026                                                                  CV ↓   EN / ES
```

- **Correo**: el elemento principal, serif `text-heading`, anclado abajo a la izquierda. Es un botón que copia; debajo, dos acciones en `text-ui`: "Copiar correo" y "Abrir en tu correo →" (`mailto:`).
- **Cuatro tarjetas** en las columnas 5 a 8: fondo `paper`, línea fina, radio 8 px, sin sombra, 220 × 280 px, giradas −4°, 3°, −2° y 5°, solapándose un poco como cartas sobre una mesa. Cada una: etiqueta (`text-ui muted`), nombre en serif `text-heading`, y su acción abajo. Tres son enlaces; la de créditos es texto.
- **El gesto:** al pasar el cursor o enfocar una tarjeta, esta se endereza (0°) y sube 8 px; las otras se desenfocan (`--blur-rest`). En puntero fino, el grupo sigue al cursor con un paralaje de ±6 px.
- **Tarjeta de créditos**: "Next.js, GSAP y demasiado café. Tipografía: Instrument Serif y Geist.", el enlace "Código en GitHub" y el **sello de build**: `build a1b2c3d · 17 nov 2026` (ver 6.7). El personaje, a 96 px de alto, empuja el borde inferior de la tarjeta.

**Teléfono:** título, correo en `text-lead` con `overflow-wrap: anywhere`, acciones, y las cuatro tarjetas apiladas a ancho completo, giradas ±1°.

### 6.4 Ficha de proyecto (`/work/[slug]`)

**Trabajos:** (1) qué es y en qué estado está; (2) las cifras; (3) la portada en grande, que aquí por fin se lee; (4) el texto técnico, cómodo; (5) pasar al siguiente.

```
[marco completo, en el flujo]

 Plataforma interna · En producción                              (text-ui muted, col 1-4)
 TI Hub                                    Mesa de ayuda con motor de SLA, inventario,
 (título, col 1-4)                         mantenimiento…        (entradilla, col 5-8)

 ┌──────────────────────────────────────────────────────────────────────────────┐
 │ portada, col 1-8, proporción 16:9 (alto máx. 72svh); la portada centra su      │
 │ dibujo 4:3 y el resto es su color                                              │
 └──────────────────────────────────────────────────────────────────────────────┘

 160           19              23            5
 pruebas       políticas RLS   rutas         etapas de CI        (cifras en título, 2 col c/u)

 Rol     …            Sobre el proyecto
 Stack   …            Párrafos en text-body, col 4-6 (≈ 66 caracteres por línea).
 Lanz.   …
 Estado  …            …
 Enlaces …
 (col 1-2, sticky a 96 px del tope)

 ← Anterior                                                          Siguiente →
 Marketplace B2B                                                     Attendance
 (encabezado, col 1-4)                                               (encabezado, col 5-8, derecha)

 [pie: © 2026 · Hecho en Querétaro, México · sello de build · CV ↓ · EN / ES]
```

- Las cifras son la primera fila tras la portada: valor en serif `text-title`, etiqueta en `text-ui muted`. Hasta cuatro, dos columnas cada una.
- Ritmo: 48 px entre cabecera y portada, 96 px entre portada y cifras, 160 px entre cifras y cuerpo, y entre cuerpo y navegación.
- Anterior y siguiente: al pasar el cursor por uno, el otro se desenfoca.
- La cabecera oscura duplicada a mano desaparece: la ficha usa `PageTitle` como todas.

**Teléfono:** cabecera apilada, portada 4:3 a ancho completo, cifras en rejilla de 2, `MetaList` (no sticky), cuerpo a 4 columnas, navegación apilada.

### 6.5 Índice (`/work`, antes `/playground`)

**Trabajos:** (1) ver los nueve proyectos de un vistazo y compararlos; (2) abrir uno.

```
 Índice                                            Sistemas que opero y proyectos personales…
 (título, col 1-3)                                 (entradilla, col 5-8)

 №    Proyecto              Categoría             Stack                    Año    Estado          Cifra
 ──────────────────────────────────────────────────────────────────────────────────────────────────────
 01   TI Hub                Plataforma interna    Next.js 15 · Supabase…   2026   En producción   160 pruebas
 02   Attendance            Sistema interno       PostgreSQL · PL/pgSQL…   2026   En producción   345 aserciones SQL
 …
```

- Una fila por proyecto, toda ella enlace a la ficha, separadas por línea fina. Columnas: № (col 1, `muted`, tabular), Proyecto (col 2, serif 24 / 28), Categoría (col 3), Stack (col 4-5, los tres primeros unidos con `·`), Año (col 6), Estado (col 7), Cifra (col 8: `numbers[0]`, valor `ink` y etiqueta `muted`). Fila de 64 px.
- **El gesto:** al pasar el cursor o enfocar una fila, las demás se desenfocan y la portada de esa fila aparece a 2 columnas de ancho siguiendo al cursor en vertical, anclada a las columnas 6-7. Solo en puntero fino; no existe en táctil ni con movimiento reducido.
- Es una tabla semántica (`<table>` con `<th scope="col">`).
- Redirección permanente de `/[locale]/playground` a `/[locale]/work` en `next.config.ts`; actualizar `sitemap.ts`.

**Teléfono:** cada fila pasa a bloque: № y categoría (`text-ui muted`), nombre (serif 24 / 28), cifra y estado en una línea. Sin vista previa.

### 6.6 404

Modo Pantalla. Arriba a la izquierda, `MetaList` con el "incidente": `Estado 404`, `Ruta` (la ruta pedida, leída en el cliente), `Causa: esta ruta no está en producción`. Abajo a la izquierda, `404` en `text-display`, `ink`. En las columnas 5 a 8, dos enlaces en `text-heading`: "Volver al inicio" e "Ir al índice". El idioma se toma del primer segmento de la ruta.

### 6.7 Sello de build

Componente `BuildStamp`: `build <7 caracteres del commit> · <fecha del build>`. El commit sale de `VERCEL_GIT_COMMIT_SHA` y la fecha se fija al construir, ambos inyectados desde `next.config.ts` junto al identificador de despliegue que ya se inyecta. En local muestra `build local`. Aparece en la tarjeta de créditos y en el pie de las páginas de lectura. Es `text-ui muted`, tabular.

## 7. Movimiento

Frontera entre motores: **CSS** hace las entradas, los hovers y todo lo que es "pasar de un estado a otro". **GSAP** hace las cuatro coreografías con estado: preloader, carrusel, telón y cabeza. Ambos leen los tokens de 3.4. Ningún componente escribe una duración, una curva o un `matchMedia` propios: las consultas viven en `src/lib/motion.ts` (`MQ.motion`, `MQ.fine`, `MQ.stage`).

### 7.1 La primitiva de entrada (CSS)

```css
@keyframes enter {
  from { opacity: 0; filter: blur(var(--blur)); translate: 0 8px; }
}
[data-enter] {
  animation: enter var(--dur-base) var(--ease) both;
  animation-delay: calc(var(--i, 0) * var(--stagger));
}
/* Nothing enters while a curtain is on screen. */
html:is([data-intro], [data-curtain]) [data-enter] { animation-play-state: paused; }
```

- Se marca con `data-enter` y un índice `--i` en línea. Orden en toda página: título (0), entradilla (1), bloques de contenido (2…), nunca más de 8 pasos.
- Bajo el pliegue (fichas, índice, Home apilado) un único componente cliente, `EnterOnView`, añade `data-enter` cuando el elemento entra en el viewport (`IntersectionObserver`, una sola vez).
- **Salida:** `opacity 0` + `blur(var(--blur))` en `--dur-fast`, sin desplazamiento.
- **Vecinos:** `opacity .45` + `blur(var(--blur-rest))` en `--dur-fast` (menú, lista de nombres, índice, tarjetas, anterior/siguiente). Una sola regla CSS reutilizable: `[data-siblings]:hover > :not(:hover)` y su equivalente con `:focus-within`.
- El desenfoque solo se anima sobre texto y elementos pequeños. Las portadas se mueven únicamente con `transform` y `opacity`.

### 7.2 Preloader (GSAP, se conserva)

Mismo guion y mismo mecanismo (`data-intro` puesto por el script de `<head>`, una vez por pestaña, solo en Home, seguro de 6 s, botón "Saltar intro"): telón `ink` a pantalla completa, el personaje entra, se esfuerza y empuja el telón hacia la derecha; detrás aparece la portada con el nombre en acento. Cambios:

- Duración total máxima 2.6 s; cada beat usa `--dur-slow` o `--dur-base`.
- Contador `0–100` y "Cargando" en `text-ui`, tabular, color `bg`, abajo a la izquierda en la línea de la columna 1.
- Al salir el telón, se quita `data-intro` y el texto de la portada entra con la primitiva (el nombre no: ya estaba ahí, es lo que el telón descubre).
- Con movimiento reducido no hay preloader.

### 7.3 Telón de página (GSAP, sustituye a `PageTransition`)

Decisión: el panel naranja inclinado se retira; su contenido (el destino, el personaje que empuja una barra) sobrevive en un telón claro. Motivo: un panel de acento a pantalla completa en cada navegación sería el uso más ruidoso del color que el sistema reserva para el nombre, y uno negro es la "pantalla muerta" que ya se descartó. El telón de papel es claro sobre claro, enseña el destino desde el primer fotograma y deja al personaje como única nota de color.

| Acto | Duración | Qué pasa |
|---|---|---|
| Sube | 450 ms | Panel `paper` con línea fina superior sube desde abajo (`translateY 100% → 0`). `html[data-curtain]` se activa. A los 150 ms entra, con la primitiva, el **título de destino** en `text-title`, centrado, y debajo la **ruta** en `text-ui muted` (`lhernandez.dev/es/about`). |
| Espera | mínimo 350 ms | Abajo, a 56 px del borde, una línea de 1 px de margen a margen. El personaje (64 px de alto) camina empujando su extremo: la línea crece hasta el 70 % y sigue avanzando despacio mientras la ruta no llegue. |
| Baja | 450 ms | Con la ruta lista: empuja la línea hasta el 100 % (200 ms), el panel sale por arriba (`translateY 0 → −100%`), se quita `data-curtain` y la página nueva entra con la primitiva. |

- Total habitual: ~1.25 s. Las rutas son estáticas y están precargadas, así que la espera casi nunca supera el mínimo.
- Se conserva de `PageTransition`: la intercepción de enlaces internos (`shouldHandleNavigation`), el foco al contenido nuevo (`focusPageContent`), la consulta de versión nueva y el seguro de 6 s que levanta el telón si la ruta no llega.
- No hay telón en: atrás/adelante del navegador, enlaces a la misma página, clics con modificador, cambio de idioma y movimiento reducido. En esos casos la navegación es inmediata y la página entra con la primitiva.
- Solo se animan `transform` y `opacity`.

### 7.4 Carrusel de Home (GSAP)

- **Entrada:** el plugin `Observer` de GSAP escucha rueda, toque y puntero sobre el contenedor; `tolerance: 12`, `preventDefault: true`. Un paso por gesto: tras avanzar se ignoran entradas durante 700 ms, para que la inercia de un trackpad no salte tres proyectos. El teclado pasa por el mismo controlador.
- **Un número manda:** el estado es `position` (0 a 9). Al cambiar, un único tween lleva un valor continuo de la posición vieja a la nueva en `--dur-slow`, y en cada fotograma una función pura (`placeCovers`) coloca cada portada interpolando entre cinco ranuras:

| Ranura (i − posición) | x (centro) | y (centro) | Giro | Escala | Opacidad |
|---|---|---|---|---|---|
| −2 | línea col 3 | −60 % del alto del lienzo | −14° | 0.7 | 0 |
| −1 | línea col 4 | asoma por arriba el 26 % de su propio alto (≈ 70 px) | −7° | 0.8 | 1 |
| 0 | centro del lienzo | centro del lienzo | 0° | 1 | 1 |
| +1 | línea col 6 | asoma por abajo el 26 % de su propio alto (≈ 70 px) | 7° | 0.8 | 1 |
| +2 | línea col 7 | 160 % del alto del lienzo | 14° | 0.7 | 0 |

- **Texto:** los metadatos, la cifra y el resumen de cada proyecto ya están en el HTML; el controlador solo mueve `data-active`. El saliente usa la salida (200 ms); el entrante la primitiva, escalonado: metadatos, cifra, resumen.
- **La cifra rueda:** el servidor parte el valor en caracteres (`<span style="--i:n">`). Al activarse, cada carácter sube desde `translateY(100%)` con desenfoque, en `--dur-base` y un escalonado de 40 ms; al salir, sube a `−100%`. Un contenedor con `overflow: clip` hace de ventana. El valor completo va en `aria-label` y los caracteres en `aria-hidden`.
- **Portada:** entre 0 y 1 el nombre y su texto salen (200 ms) y la primera portada viaja desde la ranura +2 al centro.
- **Proyectos inactivos:** llevan `inert` en modo Pantalla, así ni el teclado ni un lector de pantalla caen en ellos.
- **Anuncio:** región `aria-live="polite"` con "Proyecto 2 de 9: Attendance".
- El modo Pantalla de Home exige además `html[data-js]`, atributo que pone el script de `<head>` que ya decide el preloader.

### 7.5 Cabeza de About (GSAP, se conserva)

Sin cambios de guion. Se alinean las duraciones a los tokens (tapa y objetos en `--dur-slow`, tarjeta en `--dur-base`).

### 7.6 Movimiento reducido y táctil

| Situación | Comportamiento |
|---|---|
| `prefers-reduced-motion: reduce` | Sin preloader ni telón. La primitiva se reduce a un fundido de 150 ms sin desenfoque ni desplazamiento. El carrusel cambia con ese mismo fundido, sin viaje. El retrato no respira ni sigue al cursor; la cabeza se abre sin animación. Sin paralaje ni vista previa en el índice. |
| Táctil con `stage:` (tableta apaisada) | El carrusel responde a deslizamiento vertical. No hay efectos de hover; el desenfoque de vecinos se activa solo con foco de teclado. |
| Táctil sin `stage:` (teléfono) | Scroll nativo en todas las páginas. Barra compacta. Sin secuestro de gestos. |
| Sin JavaScript | Todo el contenido visible y apilado; las entradas CSS corren; las capas de About se renderizan como secciones normales al final de la página y se convierten en capa al hidratar. |

## 8. Librerías

Dependencias de ejecución hoy: `next`, `react`, `react-dom`, `gsap`, `@gsap/react`, `lenis`, `@rive-app/react-canvas`. En v2 quedan cinco. **No se añade ninguna.**

| Librería | Decisión | Motivo | Coste |
|---|---|---|---|
| `gsap` (núcleo) + `@gsap/react` | Se queda | Las cuatro coreografías necesitan líneas de tiempo, interrupción limpia y `matchMedia`. Es el único motor de animación con JavaScript. | Ya está en el bundle. Complejidad: se concentra en 4 archivos. |
| `gsap/Observer` | Se empieza a usar (viene en el paquete) | Normaliza rueda, toque y puntero en "arriba/abajo" con tolerancia. Sustituye al anclaje por scroll. | Pocos KB; se carga solo en Home y solo con `stage:`. |
| `gsap/ScrollTrigger` | Se deja de importar | Ya no hay nada anclado ni ligado al scroll. Las entradas bajo el pliegue usan `IntersectionObserver`. | Resta peso de todas las páginas (hoy se registra en `lib/gsap.ts`, que importa todo componente animado). |
| `gsap/Flip` | Se deja de importar | Solo lo usaba la galería de Playground, que pasa a ser una tabla. | Resta. |
| `lenis` | **Se elimina** | Su trabajo era sincronizar el scroll suave con el anclaje del carrusel. Sin anclaje, solo quedaría suavizando dos páginas de lectura, donde el scroll nativo es lo más respetuoso. Se van `SmoothScroll.tsx` (80 líneas), `lib/scroll.ts`, el observador de bloqueos y un CSS. | Resta una dependencia y una fuente de fallos. Si se echa de menos el "peso" del scroll, volver a añadirlo acotado a las fichas es un archivo. |
| `@rive-app/react-canvas` | **Se elimina** | Instalada y nunca importada. Con ella, `public/rive/`, `site.riveCharacter` y `rive` en el `matcher` de `proxy.ts`. | Resta. |
| `gsap/SplitText` | No se añade | Partir títulos en letras es el recurso de moda; aquí el material es el desenfoque del bloque entero. Las líneas que deben entrar por separado ya vienen separadas del contenido. | — |
| View Transitions del navegador | No en v2 | Sería la forma nativa de hacer crecer la portada del carrusel hasta la cabecera de la ficha. La bandera de Next es experimental y la guía local no se pudo leer (el checkout no tiene `node_modules`). Se anota como mejora posterior, no como dependencia del rediseño. | — |
| `<dialog>` nativo | Se adopta | Menú y capas de About: foco atrapado, `Escape`, fondo inerte y capa superior sin código ni `z-index`. | Cero KB. |

Tailwind v4 se queda como sistema de layout y tokens. Regla de estilos: tokens en `@theme`; utilidades de Tailwind para retícula, espacio y tipografía; CSS modules solo en las piezas con coreografía (portadas, carrusel, telón, preloader, cabeza, tarjetas de Contact); `style` en línea solo para pasar datos como propiedades personalizadas (`--i`, `--chars`, `--mat`).

Antes de escribir código contra Next 16, GSAP `Observer` o Tailwind `@custom-variant`, leer su documentación actual (las guías de Next están en `node_modules/next/dist/docs/`).

## 9. Rendimiento

Presupuesto por página, medido con Lighthouse móvil sobre el build de producción:

| Métrica | Objetivo |
|---|---|
| Rendimiento Lighthouse (móvil) | ≥ 95 en Home, About y una ficha |
| LCP | ≤ 1.8 s (el LCP de Home es el nombre: texto, sin imagen) |
| CLS | ≤ 0.02 |
| INP | ≤ 200 ms |
| JavaScript de primera carga en Home | Menor que el de la v1, medido antes de empezar y anotado en el PR. Referencia a batir: se eliminan `ScrollTrigger`, `Flip`, Lenis, el cursor, la marquesina y la galería. |
| Tipografías precargadas | 2 archivos: Geist e Instrument Serif normal |

Cómo se cumple:

- Las portadas siguen siendo HTML del servidor: cero JavaScript.
- En el carrusel solo se pintan la portada activa y sus dos vecinas (`content-visibility: hidden` en el resto), así que las tipografías propias de cada portada (`preload: false`) se descargan cuando esa portada se acerca, no todas al cargar.
- `Observer` y el controlador del carrusel se importan de forma dinámica solo cuando `MQ.stage` se cumple. El teléfono no descarga nada del carrusel.
- Animaciones solo con `transform`, `opacity` y, en texto pequeño, `filter`. `will-change` se pone al empezar y se quita al terminar.
- El reloj actualiza un nodo de texto por minuto; el retrato se detiene fuera de pantalla y con la pestaña oculta (ya lo hace).
- Sin imágenes rasterizadas en todo el sitio, salvo los iconos y la tarjeta OpenGraph.
- Geist Mono deja de precargarse; la cursiva de Instrument Serif deja de cargarse.

## 10. Accesibilidad

- **Contraste:** `ink` sobre `bg` 15.6:1; `muted` sobre `bg` 4.96:1 y sobre `paper` 5.42:1; acento sobre `bg` 3.26:1, por eso solo en texto ≥ 24 px. Foco: contorno de 2 px en acento con 3 px de separación.
- **Estructura:** un `<h1>` por página (el nombre en Home, el título en las demás). `<header>` para el marco, `<nav aria-label="Principal">`, `<main id="main-content">`, enlace "Saltar al contenido" como primer elemento enfocable.
- **Teclado:** todo lo que hace la rueda lo hacen las flechas, `Re Pág`/`Av Pág`, `Inicio` y `Fin` cuando el foco está en Home y no dentro de un campo. Orden de tabulación en Home: saltar, marco, enlace de la portada activa, lista de nombres. Los proyectos inactivos están `inert`.
- **Secuestro de la rueda:** solo en Home con `stage:`. El índice (`/work`) es la vía sin carrusel a los mismos nueve proyectos y está en el menú.
- **Anuncios:** cambio de proyecto, correo copiado y apertura de la cabeza usan regiones `aria-live="polite"`.
- **Capas:** `<dialog>` con `aria-labelledby` a su título; al cerrar, el foco vuelve al botón que la abrió.
- **Portadas:** siguen siendo `role="img"` con su `coverAlt`.
- **Objetivos táctiles:** 44 × 44 px mínimo en teléfono (botón de menú, cerrar, idioma, CV, filas del índice).
- **Idioma:** `lang` en `<html>`; el cambio de idioma conserva la ruta.
- **Zoom:** a 200 % de zoom la condición de alto deja de cumplirse y las pantallas pasan a modo apilado: nada se corta.

## 11. Plan de archivos

Un trabajo por archivo. Composición en las páginas, estado en hooks, cálculo en funciones puras.

```
src/app/globals.css                         tokens (@theme), variante stage:, primitiva de entrada, regla de vecinos
src/app/[locale]/layout.tsx                 fuentes, <html>, script de <head>, Curtain, TabTitle, UpdateWatcher
src/app/[locale]/(stage)/layout.tsx         StageShell: contenedor 100svh con marco arriba y abajo; barra compacta sin stage:
src/app/[locale]/(stage)/page.tsx           Home: compone Preloader, Portada, lista de proyectos y Carousel
src/app/[locale]/(stage)/about/page.tsx     About: compone título, declaración, cifras, retrato, columnas y capas
src/app/[locale]/(stage)/contact/page.tsx   Contact
src/app/[locale]/(scroll)/layout.tsx        ScrollShell: marco en el flujo, barra compacta, pie
src/app/[locale]/(scroll)/work/page.tsx     Índice
src/app/[locale]/(scroll)/work/[slug]/page.tsx  Ficha
src/app/[locale]/not-found.tsx              404 (el de rutas que Next resuelve como no encontradas)
src/app/[locale]/[...rest]/page.tsx         404 dentro del layout del idioma, para cualquier ruta sin página; noindex

src/lib/motion.ts                           EASE, DUR, MQ; espejo de los tokens CSS que usa GSAP
src/lib/gsap.ts                             registra solo useGSAP (sin ScrollTrigger)
src/lib/useMediaQuery.ts                    hook que lee una consulta de MQ
src/lib/build.ts                            lee commit y fecha del build
src/lib/navigation.ts, version.ts, metadata.ts   sin cambios

src/components/chrome/StageShell.tsx        modo Pantalla: contenedor, marco y barra compacta; respeta data-fit
src/components/chrome/ScrollShell.tsx       modo Lectura: marco en el flujo, barra compacta y pie
src/components/chrome/StageHint.tsx         ranura inferior izquierda: pista de movimiento en Home, año en el resto
src/components/chrome/IncidentReport.tsx    el "incidente" del 404: estado, ruta y causa
src/components/chrome/NotFoundScreen.tsx    la pantalla del 404, compartida por las dos rutas que la dibujan
src/components/chrome/ChromeTop.tsx         fila superior del marco
src/components/chrome/ChromeBottom.tsx      fila inferior, con ranura de pista
src/components/chrome/CompactBar.tsx        barra de 56 px; se oculta al bajar
src/components/chrome/useHideOnScroll.ts    dirección del scroll para la barra
src/components/chrome/MenuLayer.tsx         capa de menú
src/components/chrome/NavLinks.tsx          los cuatro enlaces (marco y capa)
src/components/chrome/Curtain.tsx           telón de página (+ curtain.module.css)
src/components/chrome/BuildStamp.tsx        sello de build
src/components/chrome/Clock.tsx, LocaleSwitch.tsx, TabTitle.tsx, UpdateWatcher.tsx   se conservan, con tokens

src/components/ui/PageTitle.tsx             título de página (text-title, data-enter)
src/components/ui/MetaList.tsx              pares etiqueta/valor
src/components/ui/Layer.tsx                 <dialog> a pantalla completa con ancla
src/components/ui/Figure.tsx                cifra partida en caracteres + etiqueta
src/components/ui/EnterOnView.tsx           entrada bajo el pliegue
src/components/ui/enterStep.ts              el `--i` de un paso de entrada (estilo en línea)
src/components/ui/useAnchorLayer.ts         mantiene un <dialog> y el #id de la URL sincronizados
src/components/ui/CopyEmail.tsx, Icons.tsx, Mark.tsx   se conservan, con tokens

src/components/home/Portada.tsx             nombre, eyebrow, lema, texto
src/components/home/ProjectItem.tsx         un proyecto: portada, metadatos, cifra, resumen (servidor)
src/components/home/NamesList.tsx           lista de nombres
src/components/home/Canvas.tsx              el DOM que comparten los dos layouts de Home
src/components/home/Carousel.tsx            cliente: une el hook con el DOM y GSAP
src/components/home/useCarousel.ts          posición, entrada (Observer, teclado), memoria, anuncio
src/components/home/placeCovers.ts          función pura: posición continua → transformaciones
src/components/home/carousel.module.css     layout del lienzo y estados
src/components/preloader/*                  se conserva; estilos a tokens

src/components/about/Head.tsx               sin cambios
src/components/about/InsideHead.tsx         misma lógica; tarjeta nueva y desenfoque del resto
src/components/about/AboutColumns.tsx       las cuatro listas
src/components/about/dates.ts               años y rangos de cada cargo (columna y capa Trayectoria)
src/components/about/CapabilitiesLayer.tsx, JourneyLayer.tsx, ProcessLayer.tsx

src/components/contact/ContactCards.tsx     las cuatro tarjetas (+ cards.module.css)
src/components/contact/ContactEmail.tsx     la dirección que se copia al pulsarla y sus dos acciones
src/components/contact/ParallaxStack.tsx    paralaje de 6 px hacia el puntero y regla de vecinos

src/components/work/Cover.tsx, covers/*     sin cambios
src/components/work/CaseHeader.tsx, CaseNumbers.tsx, CaseNav.tsx
src/components/work/IndexTable.tsx          tabla del índice
src/components/work/IndexPreview.tsx        vista previa que sigue al cursor (cliente)
src/components/work/slides.ts, types.ts     se conservan; se quitan las etiquetas que ya no existen

src/content/profile.ts                      se añade `figures`
src/i18n/dictionaries/en.ts, es.ts          textos nuevos (sección 12); se retiran los que sobran
next.config.ts                              redirección /playground → /work; commit y fecha del build
scripts/check-place-covers.mjs              comprobación de placeCovers.ts (npm run check:covers, parte de npm run check)
```

`placeCovers.ts` lleva una comprobación que falla si se rompe: en la posición entera `n`, la portada `n` debe quedar en la ranura 0 (giro 0, escala 1) y la `n+1` en la ranura +1. Sin entorno de pruebas en el repo, la comprobación es `scripts/check-place-covers.mjs`, que corre `npm run check` mediante `check:covers`.

### Lo que se elimina

| Archivo o pieza | Sustituto |
|---|---|
| `components/hero/*` | `home/Portada.tsx` |
| `components/work/DiscStage.tsx`, `disc.module.css` | `home/Carousel.tsx` y compañía |
| `components/work/ProjectGallery.tsx`, `gallery.module.css` | `work/IndexTable.tsx` |
| `components/chrome/PageTransition.tsx` | `chrome/Curtain.tsx` |
| `components/chrome/ContactOverlay.tsx` | la ruta `/contact` |
| `components/chrome/Frame.tsx`, `Footer.tsx`, `ScrollHint.tsx` | `ChromeTop`, `ChromeBottom`, `CompactBar` y el pie de `ScrollShell` |
| `components/SmoothScroll.tsx`, `lib/scroll.ts` | scroll nativo |
| `components/ui/Cursor.tsx`, `Marquee.tsx`, `CountUp.tsx`, `Reveal.tsx`, `PageHeader.tsx` | nada, nada, `Figure`, la primitiva CSS, `PageTitle` |
| `components/about/about.module.css` | utilidades y tokens |
| `app/[locale]/playground/` | `(scroll)/work/page.tsx` + redirección |
| En `globals.css`: `.label`, `.display`, `.outline*`, `.brutal*`, `.btn*`, `.stamp`, `.grid-paper`, `.link-draw`, marquesina, `blink`, `--ease-out-expo`, `.has-cursor` | tokens de la sección 3 |
| Dependencias `lenis` y `@rive-app/react-canvas`; `public/rive/`; `site.riveCharacter` | — |
| Claves de diccionario sin uso: `ticker`, `hero.stamp`, `hero.ctaContact`, `work.deep`, `work.hint*`, `work.all`, `playground.hint`, `playground.close`, `footer.tagline`, `footer.cta`, `footer.top` | — |
| Textos bilingües en línea (`locale === "es" ? … : …`) | claves de diccionario |

Antes de borrar cada archivo, buscar sus importaciones en todo el árbol. Al terminar, actualizar `docs/architecture.md` y el `README.md` para que describan la v2.

## 12. Textos

Los que no aparecen aquí se conservan del diccionario actual.

| Clave | Español | Inglés |
|---|---|---|
| `nav.playground` → `nav.index` | Índice | Index |
| `frame.identity` | Full-stack y TI | Full-stack & IT |
| `frame.inquiries` | Correo | Email |
| `frame.copied` | Copiado | Copied |
| `frame.scroll` | Desliza ↓ | Scroll ↓ |
| `frame.keys` | Usa las flechas | Use the arrow keys |
| `frame.skipToContent` | Saltar al contenido | Skip to content |
| `nav.close` | Cerrar | Close |
| `hero.ctaWork` | Ver el trabajo ↓ | See the work ↓ |
| `work.counter` | Trabajo seleccionado | Selected work |
| `work.announce` | Proyecto {n} de {total}: {name} | Project {n} of {total}: {name} |
| `work.projects` | Proyectos | Projects |
| `work.launchShort` | Lanz. | Launch |
| `index.title` | Índice | Index |
| `index.lead` | Sistemas que opero y proyectos personales que construyo para lo que disfruto. | Systems I operate and personal projects I build for the things I enjoy. |
| `index.cols` | № · Proyecto · Categoría · Stack · Año · Estado · Cifra | № · Project · Category · Stack · Year · Status · Figure |
| `about.figures[0]` | 5 · sistemas en producción, autor único | 5 · systems in production, sole author |
| `about.figures[1]` | 1,050 · pruebas y aserciones automatizadas | 1,050 · automated tests and assertions |
| `about.journey` | Trayectoria | Journey |
| `about.capabilitiesShort` | Capacidades | Capabilities |
| `about.open` | Abrir {name} | Open {name} |
| `about.statement` | Escribo las herramientas que usa mi departamento y respondo por su disponibilidad en el mismo reporte. | I write the tools my department runs on, and answer for their uptime in the same report. |
| `about.anchors` | capacidades · trayectoria · proceso | capabilities · journey · process |
| `contact.lead` | Escríbeme | Write to me |
| `contact.mailto` | Abrir en tu correo → | Open in your mail app → |
| `contact.cards.github` | Donde vive el código | Where the code lives |
| `contact.cards.linkedin` | Carrera y novedades | Career and updates |
| `contact.cards.cv` | CV, dos páginas | Résumé, two pages |
| `contact.cards.credits` | Créditos | Credits |
| `footer.build` | build {sha} · {date} | build {sha} · {date} |
| `footer.buildLocal` | build local | local build |
| `notFound.status` | Estado | Status |
| `notFound.route` | Ruta | Route |
| `notFound.cause` | Causa | Cause |
| `notFound.causeText` | Esta ruta no está en producción. | This route is not in production. |
| `notFound.home` | Volver al inicio | Back to home |
| `notFound.index` | Ir al índice | Go to the index |
| `curtain.label` | Cargando {page} | Loading {page} |

## 13. Criterios de aceptación

Observables en el navegador, a 1440 × 800 y a 390 × 844, en `/es` y `/en`.

**Sistema**

- S1. En los estilos computados de cualquier página solo aparecen las tallas 12, 16, 24, 32, 48, 56, 96 px y las de exhibición (fuera de las portadas).
- S2. Todo bloque de texto empieza en una línea de la retícula (20, 197.5, 375, 552.5, 730, 907.5, 1085, 1262.5 a 1440 px).
- S3. No hay `box-shadow` fuera de `[data-plate]`. No hay `mix-blend-mode`. Ningún `z-index` distinto de los cuatro tokens.
- S4. El acento solo aparece en el nombre, la declaración de About, el foco, la selección y el personaje.
- S5. `npm run check` y `npm run build` pasan. `lenis` y `@rive-app/react-canvas` no están en `package.json`.

**Home**

- H1. En 1440 × 800, 1536 × 791, 1366 × 650 y 1920 × 1080, "HERNÁNDEZ" cabe entero: su caja no sobrepasa los márgenes ni toca la fila inferior del marco.
- H2. `document.documentElement.scrollHeight === innerHeight` con `stage:` activo.
- H3. Un gesto de rueda avanza exactamente un proyecto; diez gestos rápidos seguidos no saltan más de uno por cada 700 ms.
- H4. Las flechas, `Re Pág`/`Av Pág`, `Inicio` y `Fin` hacen lo mismo que la rueda.
- H5. En cualquier posición, ningún texto queda debajo de una portada ni del marco (comprobar por cajas del DOM, no por captura).
- H6. La cifra gigante cabe en las columnas 1 a 3 para los nueve proyectos, incluido `12,990`.
- H7. Entrar en una ficha y volver deja Home en el mismo proyecto.
- H8. A 390 px no hay scroll horizontal y los nueve proyectos se leen en orden.
- H9. Con movimiento reducido no hay preloader, telón ni viaje, y todo sigue funcionando.

**About**

- A1. Con `stage:` la página mide un viewport; a 1366 × 650 nada se solapa.
- A2. La cabeza se abre con clic, toque y `Enter`; `Escape` la cierra y el foco vuelve al retrato.
- A3. Cada `+` abre su capa; `Escape` y "Cerrar" la cierran y devuelven el foco. `/es/about#proceso` y `/en/about#process` abren la capa directamente.
- A4. Sin JavaScript, el contenido de las tres capas es visible en la página.

**Contact, ficha, índice, 404**

- C1. Clic en el correo lo copia y se anuncia "Copiado".
- C2. El sello de build muestra el commit desplegado en la vista previa de Vercel.
- F1. En la ficha, el marco completo se va con el scroll; al subir aparece la barra compacta y no tapa texto.
- F2. La columna de metadatos se queda fija mientras se lee el cuerpo.
- I1. `/es/playground` redirige a `/es/work`. El índice es una `<table>`; cada fila lleva a su ficha con teclado.
- N1. Una ruta inexistente bajo `/es/` muestra el 404 en español con la ruta pedida.

**Movimiento y rendimiento**

- M1. Navegar entre dos páginas muestra el telón de papel con el título y la ruta de destino; nunca hay un fotograma negro o vacío. Atrás/adelante no muestra telón.
- M2. Ninguna animación dura algo distinto de 200, 450 o 900 ms (más el escalonado), salvo los beats internos del personaje.
- P1. Lighthouse móvil ≥ 95 en rendimiento y 100 en accesibilidad en Home, About y una ficha.
- P2. En la pestaña de red, al cargar Home solo se descargan las tipografías de las portadas visibles.

## 14. Orden de construcción

Cada paso deja el sitio construyendo y navegable.

1. **Cimientos.** Tokens, variante `stage:`, primitiva de entrada, `lib/motion.ts`, grupos de rutas con `StageShell` y `ScrollShell`, marco nuevo (completo, compacto y capa de menú), telón nuevo. Las páginas actuales se montan dentro de los nuevos layouts sin rediseñar su interior. Se retiran Lenis, Rive, cursor y marquesina. Resultado visible: marco, menú y telón nuevos en todo el sitio.
2. **Home.** Portada, carrusel, lista apilada de teléfono, preloader a tokens.
3. **About.** Composición de un viewport, cifras, columnas, capas, tarjeta de objeto.
4. **Ficha e índice.** `/work`, `/work/[slug]`, redirección, pie con sello.
5. **Contact y 404.** Tarjetas, sello de build, 404.
6. **Limpieza.** Archivos, clases y claves sin uso; `architecture.md` y `README.md` al día.

