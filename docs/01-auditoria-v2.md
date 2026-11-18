# Auditoría v2: lhernandez.dev frente a huyml.co

Fecha: 2026-11-17. Ambos sitios medidos en navegador de escritorio (viewport 1536×791) con lectura de estilos computados, más una revisión del código del repo. Complementa a `00-analisis-referencia-huyml.md`, que describe qué es huyml.co; este documento explica por qué se siente más ordenado y qué cambia en la v2.

## Conclusión en una frase

huyml.co no es minimalista por tener menos cosas, sino por tomar muy pocas decisiones y repetirlas en todo el sitio. lhernandez.dev tiene los mismos ingredientes (marco fijo, serif gigante, carrusel, personaje), pero cada componente tomó sus propias decisiones de tamaño, margen, tiempo y estilo.

## Los dos sitios en números

| Decisión | huyml.co | lhernandez.dev |
|---|---|---|
| Tallas de texto | 6 en total: 10 px para toda la interfaz (254 de ~290 textos de la portada), 16, 23, 48, 80 y una talla de exhibición (180 a 300 px) | 14 en la portada, 28 en About, 12 en la ficha de proyecto; unas 45 distintas en el código |
| Familias en la interfaz | 1 grotesca para todo lo funcional + 1 serif solo para títulos | 3: Geist Mono en mayúsculas domina (79 textos en la portada), Instrument Serif (35), Geist (15) |
| Estilo de etiquetas | Minúsculas, gris al 52 % para la etiqueta y negro para el valor | Mono en mayúsculas con tracking amplio en casi todo |
| Retícula | 8 columnas de ~187 px con margen de 20 px; menú, reloj, correo y columnas de contenido caen en las mismas líneas (20, 207, 581, 768, 955…) | Sin contenedor compartido: tres márgenes laterales distintos según la página y sin columnas comunes |
| Color | Fondo `#ECECEC`, tinta `#1E1E1E`, un gris y un acento `#FF4949` que solo aparece en el nombre y en las frases de About | Misma base, pero el acento naranja aparece en logo, nombre, tarjetas, botones, marquesina, sellos y decoraciones |
| Superficies | Sin sombras ni bordes; un solo radio (8 px) | 3 sombras distintas, bordes de 0.8, 1.6 y 5.6 px, tarjetas inclinadas, papel cuadriculado, marquesina |
| Movimiento | 1 curva (`cubic-bezier(.22,1,.36,1)`, 0.45 s) y fundidos de 0.22 a 0.32 s; el desenfoque es el material de todas las transiciones | ~35 duraciones, 4 curvas CSS más 6 easings de GSAP, y dos motores distintos para "entrar" (WAAPI y GSAP) |
| Alto de página | Cada ruta es una pantalla compuesta: portada y About miden exactamente un viewport | Portada 7 954 px, About 7 046 px (8.9 pantallas), ficha de proyecto 4 pantallas |
| Portada del proyecto activo | ~21 % del ancho de la pantalla, rodeada de vacío | ~33 % del ancho, con tres portadas visibles a la vez que se enciman |
| Controles del carrusel | Scroll y la rueda de nombres | Scroll, rueda, puntos de color, flechas, texto de ayuda, enlace "every project" y barra de progreso |

## Qué hace huyml.co, pieza por pieza

1. **Una pantalla por página.** El scroll en la portada mueve el carrusel, no la página. About cabe entero en un viewport: cuatro listas en columnas ancladas abajo (premios, publicaciones, capacidades, clientes), dos cifras gigantes, el avatar al centro y un párrafo en rojo. El detalle largo ("Process & Approach") se abre encima como capa. Contact es una capa, no una ruta (su URL directa devuelve 404). Solo Playground hace scroll, y es una galería en columnas de ancho fijo.
2. **El marco nunca compite con el contenido.** Como las páginas no hacen scroll, el texto del contenido nunca pasa por debajo del menú, el reloj o el correo.
3. **Un único gesto de entrada.** Todas las páginas abren igual: telón negro, título en serif a 80 px, el telón sube. Dentro de la página, los textos entran y salen desenfocados; al pasar el cursor por un ítem del menú, los demás se desenfocan.
4. **Jerarquía por escala, no por adorno.** Solo hay dos niveles visibles: lo diminuto (10 px) y lo enorme (180 a 300 px). No hay tamaños intermedios que disputen la atención.
5. **El color lo ponen las imágenes.** Fuera de las portadas de proyecto todo es gris, negro y un rojo usado dos veces.

## Hallazgos en lhernandez.dev

### Críticos (se ven rotos)

- **El marco fijo se encima con el contenido en todas las páginas largas.** En About, "Working from" queda sobre el texto del cuerpo y "For inquiries" sobre la columna derecha; el botón de CV tapa párrafos. En la ficha de proyecto el menú cae sobre la portada y no se lee. En la portada, las portadas del carrusel pasan por debajo del reloj y del correo. Causa: marco con `mix-blend-difference` pensado para una pantalla fija, usado sobre páginas de hasta 9 pantallas.
- **El nombre del hero no cabe.** "HERNÁNDEZ" a 305 px se corta por la derecha y por abajo en 1536×791, y comparte la pantalla con una rueda decorativa, una tarjeta inclinada con sombra, coordenadas, dos filas de etiquetas y una regla.

### Estructurales (causan el desorden)

- **Sin escala tipográfica.** No existen tokens de tamaño; solo las clases `.label` y `.display`. Cada componente fija su talla en `rem`, `em`, `px`, `vw` o `clamp()`.
- **Sin retícula ni contenedor.** Hero y About usan `clamp(1rem,3vw,3.5rem)`, la galería `3.5vw`, y Contact, fichas y pie `px-4 md:px-6`. El ritmo vertical también es ad hoc (10.5 rem, 9.5 rem, `pt-32`, `py-16/24`, `py-20/28`…), y el desplazamiento del encabezado fijo se corrige a mano en cada página.
- **Dos lenguajes visuales mezclados.** Editorial (serif, líneas finas, fondo papel) y brutalista (bordes de 2 px, sombras duras, sellos rotados, cuadrícula, marquesina) conviven en la misma página.
- **Dos puntos de quiebre para el layout.** El carrusel cambia a 900 px y el resto del sitio a 768 px.
- **Cuatro formas de dar estilo.** Tailwind (379 `className` fuera de las portadas), CSS modules, CSS global y `style` en línea, repartidas por página sin regla.
- **Movimiento sin sistema.** Cada componente escribe su propio `matchMedia`, sus duraciones y sus curvas. `Reveal` usa WAAPI y el resto GSAP.
- **Capas sin escala.** 13 valores de `z-index` sueltos (1 a 100); el carrusel (60) queda por encima del marco (40).

### Menores

- `@rive-app/react-canvas` está instalado y no se importa en ningún archivo.
- Textos bilingües escritos en línea (`locale === "es" ? … : …`) fuera del diccionario.
- `/playground` y `/work/[slug]` son dos versiones largas del mismo contenido.
- El encabezado oscuro de página está duplicado a mano en la ficha de proyecto.
- El `matcher` de `src/proxy.ts` escribe `\.` dentro de una cadena normal; conviene comprobar que excluye lo que debe (no verificado en ejecución).

### Lo que ya está bien y se conserva

- Rutas reales, enlazables e indexables, y versión EN/ES: dos cosas que huyml.co no tiene.
- Respeto a `prefers-reduced-motion` y alternativa táctil en casi todos los sistemas de animación.
- Portadas dibujadas en código, modelo de contenido tipado, SEO y tarjetas OpenGraph.
- El personaje del preloader y el retrato de About: son el equivalente del gesto firma de huyml.co.

## Sistema propuesto para la v2

Estas reglas son la base común, sea cual sea el alcance del rediseño.

| Tema | Regla |
|---|---|
| Tipografía | Instrument Serif solo para títulos; Geist para toda la interfaz y el cuerpo. Geist Mono queda dentro de las portadas y del código. |
| Escala | Seis tallas con nombre: 12 (interfaz y etiquetas), 16 (cuerpo), 24 (entradilla), 48 (título de sección), 96 (título de página) y exhibición fluida (el nombre, que siempre cabe en la pantalla). 12 px en lugar de los 10 px de huyml.co por legibilidad. |
| Etiquetas | Minúsculas; etiqueta en gris, valor en tinta. Sin mayúsculas mono con tracking. |
| Retícula | 8 columnas, margen de 20 px (16 px en móvil), un único componente contenedor. Marco y contenido se anclan a las mismas líneas. Un solo punto de quiebre de layout. |
| Color | `bg`, `ink`, `muted`, `line`, `accent`. El acento vive en el nombre y en un estado activo. Los colores de proyecto solo existen dentro de sus portadas. |
| Superficies | Línea fina o nada. Se retiran `.brutal`, sellos, papel cuadriculado, marquesina y sombras fuera de las portadas. |
| Movimiento | Una curva (`cubic-bezier(.22,1,.36,1)`), tres duraciones (200, 450 y 900 ms) y una sola primitiva de entrada (opacidad + desenfoque + 8 px), compartidas desde un módulo. |
| Capas | Escala de cinco niveles con nombre: contenido, marco, capa, transición, preloader. |
| Marco | Deja de encimarse: en páginas con scroll se oculta al bajar y vuelve al subir, sobre fondo sólido. |
| Carrusel | Una portada protagonista a ~22 % del ancho, alineada a la retícula; las vecinas se alejan del texto. Controles: scroll, teclado y la rueda de nombres. |
| Estilos | Tokens en `globals.css` (`@theme`), Tailwind para layout y CSS modules solo para piezas con animación compleja. |

## Alcances posibles

**A. Solo el sistema.** Mismas páginas y mismo contenido, reconstruidos sobre los tokens, la retícula y las primitivas de movimiento. Corrige el desorden y los choques del marco. Riesgo bajo; el sitio se ve más limpio pero conserva las páginas largas.

**B. Una pantalla por página.** Modelo huyml.co completo: portada, About y Contact como composiciones de un solo viewport y las fichas de proyecto como capa. Es lo más fiel a la referencia, pero obliga a recortar casi todo el texto de About y de las fichas (hoy 9 y 4 pantallas), que es justo el contenido que distingue a un desarrollador de un diseñador.

**C. Híbrido (recomendado).** Portada, About y Contact como pantallas compuestas: About condensa persona, capacidades y trayectoria en columnas de un viewport y abre el detalle (proceso, experiencia completa) como capa, igual que "Process & Approach". Las fichas de proyecto siguen siendo páginas con scroll, porque ahí está la evidencia técnica, pero sobre la misma retícula, escala y marco que se oculta. `/playground` se convierte en índice de proyectos en columnas.

## Fuera de alcance

- Cambiar el contenido de los proyectos o las portadas dibujadas (solo cambia su tamaño y colocación).
- Base de datos, formulario de contacto o panel de edición.
- Sustituir el personaje por una animación Rive; la dependencia sin uso se retira.
