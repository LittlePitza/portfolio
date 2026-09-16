import type { Localized } from "@/i18n/config";

export type HeadIcon =
  | "database"
  | "pipeline"
  | "lock"
  | "pellet"
  | "report"
  | "cube"
  | "coffee"
  | "mic"
  | "meeple"
  | "pizza"
  | "headphones"
  | "gamepad"
  | "knight"
  | "code";

export interface HeadItem {
  icon: HeadIcon;
  title: Localized;
  /** Told by the object itself. */
  story: Localized;
  signature: Localized;
}

/** What floats out when the head opens on the About page: the things he actually loves. */
export const headItems: HeadItem[] = [
  {
    icon: "meeple",
    title: { en: "Board games", es: "Juegos de mesa" },
    story: {
      en: "He loves learning a new one almost as much as playing it: the rulebook first, then the table. Catan, Scythe and Root are the favourites, which tells you he likes trading, engines and asymmetric factions in equal measure.",
      es: "Le encanta aprender uno nuevo casi tanto como jugarlo: primero el reglamento, luego la mesa. Catan, Scythe y Root son los favoritos, lo que dice que le gustan por igual el comercio, los motores y las facciones asimétricas.",
    },
    signature: { en: "A meeple, waiting for its turn", es: "Un meeple, esperando su turno" },
  },
  {
    icon: "knight",
    title: { en: "Chess", es: "Ajedrez" },
    story: {
      en: "Everything on the board is public information and he still loves getting out-thought. I am the only piece that jumps, which is probably why I am his favourite.",
      es: "Todo en el tablero es información pública y aun así le encanta que lo superen pensando. Soy la única pieza que salta, y probablemente por eso soy su favorita.",
    },
    signature: { en: "The knight, two squares and one over", es: "El caballo, dos casillas y una de lado" },
  },
  {
    icon: "pizza",
    title: { en: "Pizza", es: "Pizza" },
    story: {
      en: "The reward at the end of a go-live, the fuel during a long game night, and the one thing in this head that needs no justification.",
      es: "La recompensa al final de un arranque, el combustible en una noche larga de juegos, y lo único en esta cabeza que no necesita justificación.",
    },
    signature: { en: "The last slice", es: "La última rebanada" },
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
  {
    icon: "headphones",
    title: { en: "Music", es: "Música" },
    story: {
      en: "On for every long debugging session and every late migration. The playlist jumps from bbno$ to Siddhartha to Imagine Dragons without warning; the volume stays where it is.",
      es: "Puesta en cada sesión larga de depuración y cada migración nocturna. La playlist salta de bbno$ a Siddhartha y a Imagine Dragons sin avisar; el volumen se queda donde está.",
    },
    signature: { en: "The headphones, always nearby", es: "Los audífonos, siempre cerca" },
  },
  {
    icon: "gamepad",
    title: { en: "Video games", es: "Videojuegos" },
    story: {
      en: "The other way he unwinds. Life is Strange for the story, Cyberpunk 2077 for the city, Fallout for the wasteland. He reads a new game's systems with the same patience he reads a contract.",
      es: "Su otra forma de desconectar. Life is Strange por la historia, Cyberpunk 2077 por la ciudad, Fallout por el yermo. Lee los sistemas de un juego nuevo con la misma paciencia con la que lee un contrato.",
    },
    signature: { en: "The controller, charged", es: "El control, cargado" },
  },
  {
    icon: "code",
    title: { en: "Code & design", es: "Código y diseño" },
    story: {
      en: "He draws the interface and writes the database, and refuses to pick just one. This site is the proof: every animation by hand, every string typed in TypeScript, and a portrait he asked to be redrawn until it looked like him.",
      es: "Dibuja la interfaz y escribe la base de datos, y se niega a elegir solo una. Este sitio es la prueba: cada animación a mano, cada texto tipado en TypeScript, y un retrato que pidió redibujar hasta que se pareciera a él.",
    },
    signature: { en: "The editor, always open", es: "El editor, siempre abierto" },
  },
];
