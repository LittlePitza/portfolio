export const site = {
  name: "Luis Hernández",
  fullName: "Luis Eduardo Hernández Cruz",
  /** Two lines of the giant hero name. */
  heroName: ["LUIS", "HERNÁNDEZ"],
  initials: "LH",
  email: "lhernandez025cz@gmail.com",
  location: { city: "Querétaro", country: "MX", timeZone: "America/Mexico_City" },
  url: "https://luishernandez.dev",
  links: {
    github: "https://github.com/LittlePitza",
    linkedin: "https://www.linkedin.com/in/lhernandez25",
  },
  cv: { en: "/cv/Luis-Hernandez-CV-EN.pdf", es: "/cv/Luis-Hernandez-CV-ES.pdf" },
  /** Set to a file under /public/rive to replace the SVG placeholder character. */
  riveCharacter: null as string | null,
} as const;
