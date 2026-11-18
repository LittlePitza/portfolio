/* Maqueta v2: marco, reloj, telón de página y personaje. No es código de producción. */
const PAGES = [
  { href: "home.html", id: "home", label: "Trabajo", title: "Trabajo", route: "lhernandez.dev/es" },
  { href: "about.html", id: "about", label: "Sobre mí", title: "Sobre mí", route: "lhernandez.dev/es/about" },
  { href: "#", id: "index", label: "Índice", title: "Índice", route: "lhernandez.dev/es/work" },
  { href: "#", id: "contact", label: "Contacto", title: "Saluda", route: "lhernandez.dev/es/contact" },
];
const EMAIL = "lhernandez025cz@gmail.com";
const page = document.body.dataset.page;

function sneaker(x, y, r) {
  return `<g transform="translate(${x} ${y}) rotate(${r})">
    <path d="M-10 -16 L10 -16 L11 2 L-10 2 Z" fill="var(--paper)" stroke-width="5"/>
    <path d="M-16 0 C-19 8 -15 16 -6 18 L42 18 C52 18 58 12 56 6 C54 0 46 -3 36 -3 L14 -3 C6 -3 2 -6 0 -10 L-10 -8 Z" fill="var(--paper)"/>
    <path d="M-15 19 L44 19 C54 19 59 14 57 8" stroke-width="7"/></g>`;
}

/** El personaje del sitio, empujando. Trazado tomado de src/components/preloader/Character.tsx. */
function character() {
  const beard = "M214 126 C220 152 244 166 270 158 C288 152 296 134 294 114 C288 122 280 126 270 124 C258 134 240 134 226 122 C220 124 216 124 214 126 Z";
  const hair = "M196 106 C186 68 206 38 246 38 C272 38 292 52 296 74 C280 60 258 58 240 66 C222 74 206 90 196 106 Z";
  return `<svg viewBox="0 0 340 420" aria-hidden="true" fill="none" stroke="var(--ink)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M150 262 L102 318 L74 372" stroke-width="26"/>${sneaker(74, 372, -14)}
    <path d="M182 268 L194 330 L190 372" stroke-width="28"/>${sneaker(190, 372, 0)}
    <path d="M214 210 L262 214 L304 202" stroke-width="24"/><path d="M214 210 L262 214" stroke="var(--accent)" stroke-width="15"/>
    <path d="M262 214 L304 202" stroke="var(--paper)" stroke-width="15"/>
    <path d="M302 192 L322 188 C328 187 331 192 330 198 L328 214 C327 219 322 221 318 219 L300 214 Z" fill="var(--paper)" stroke-width="5"/>
    <path d="M176 178 C186 164 224 160 242 176 L200 274 C182 282 150 280 138 264 Z" fill="var(--accent)"/>
    <path d="M222 168 L246 178 L232 224 L206 206 Z" fill="var(--ink)" stroke="none"/>
    <path d="M234 184 L274 180 L308 168" stroke-width="26"/><path d="M234 184 L274 180" stroke="var(--accent)" stroke-width="17"/>
    <path d="M274 180 L308 168" stroke="var(--paper)" stroke-width="17"/>
    <path d="M306 156 L326 152 C332 151 336 156 335 162 L333 180 C332 185 327 187 323 185 L304 180 Z" fill="var(--paper)" stroke-width="5"/>
    <path d="M226 150 L246 156 L240 180 L214 172 Z" fill="var(--paper)"/>
    <path d="M198 98 C198 62 222 46 252 50 C282 54 298 84 292 114 C290 128 284 138 276 144 C258 158 232 158 216 146 C204 136 198 118 198 98 Z" fill="var(--paper)"/>
    <path d="${beard}" fill="var(--ink)"/><path d="M262 132 L282 126" stroke="var(--paper)" stroke-width="6"/>
    <path d="${hair}" fill="var(--ink)"/><path d="M212 76 C226 58 250 52 272 58" stroke="var(--paper)" stroke-width="3"/>
    <path d="M212 104 C204 100 200 110 208 118" fill="var(--paper)" stroke-width="4"/>
    <path d="M252 82 L282 92" stroke-width="7"/><path d="M262 100 L280 102" stroke-width="5"/>
    <path d="M290 100 C298 106 298 112 290 116" stroke-width="5"/>
    <path d="M302 74 C298 80 298 86 302 86 C306 86 306 80 302 74 Z" fill="var(--paper)" stroke-width="3"/>
  </svg>`;
}

function navLinks() {
  return PAGES.map((p) => {
    const current = p.id === page ? ' aria-current="page"' : "";
    return `<a href="${p.href}" data-to="${p.id}"${current}>${p.label}</a>`;
  }).join("");
}

function renderChrome() {
  const stage = document.querySelector(".stage");
  const hint = document.body.dataset.hint ?? "© 2026";
  stage.insertAdjacentHTML("afterbegin", `
    <div class="bar"><a class="brand" href="home.html"><span class="mark">LH</span><span>Luis Hernández</span></a>
      <button type="button" data-open-menu>Menú</button></div>
    <header class="chrome-top grid">
      <a class="brand" href="home.html" data-to="home"><span class="mark">LH</span>
        <span>Luis Hernández<br><span class="muted">Full-stack y TI</span></span></a>
      <div class="menu"><p class="muted">Menú</p><nav class="nav" data-siblings aria-label="Principal">${navLinks()}</nav></div>
      <div class="clock"><p class="muted">Trabajando desde</p><p class="num">Querétaro, MX · <span data-clock>--:--</span></p></div>
      <div class="mail"><p class="muted" data-mail-label>Correo</p><button type="button" data-copy>${EMAIL}</button></div>
    </header>`);
  stage.insertAdjacentHTML("beforeend", `
    <footer class="chrome-bottom"><span class="muted" data-hint>${hint}</span>
      <div><a href="#">CV ↓</a><span>ES <span class="muted">/ EN</span></span></div></footer>`);
  document.body.insertAdjacentHTML("beforeend", `
    <dialog class="layer menu-layer"><div class="layer-head"><span class="muted">Menú</span>
      <button type="button" data-close>Cerrar</button></div>
      <nav class="nav" data-siblings aria-label="Principal">${navLinks()}</nav></dialog>
    <div class="curtain" aria-hidden="true"><div class="curtain-title"><h2 class="t-title" data-curtain-title></h2>
      <p class="muted" data-curtain-route></p></div>
      <div class="curtain-track"><div class="curtain-line"></div><div class="curtain-runner">${character()}</div></div></div>`);
}

function startClock() {
  const format = new Intl.DateTimeFormat("es-MX", { timeZone: "America/Mexico_City", hour: "2-digit", minute: "2-digit", hour12: false });
  const tick = () => document.querySelectorAll("[data-clock]").forEach((el) => (el.textContent = format.format(new Date())));
  tick();
  setInterval(tick, 30000);
}

function fillCurtain(target) {
  document.querySelector("[data-curtain-title]").textContent = target.title;
  document.querySelector("[data-curtain-route]").textContent = target.route;
}

/** Telón de papel: sube con el destino escrito, el personaje empuja la línea y sale por arriba. */
function wireCurtain() {
  const root = document.documentElement;
  const curtain = document.querySelector(".curtain");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (root.dataset.curtain === "in") {
    fillCurtain(PAGES.find((p) => p.id === page));
    sessionStorage.removeItem("mock:nav");
    setTimeout(() => (root.dataset.curtain = "out"), 450);
    setTimeout(() => {
      curtain.style.transition = "none";
      delete root.dataset.curtain;
      void curtain.offsetHeight;
      curtain.style.transition = "";
    }, 950);
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[data-to]");
    if (!link) return;
    const target = PAGES.find((p) => p.id === link.dataset.to);
    if (target.href === "#") {
      event.preventDefault();
      return;
    }
    if (target.id === page || reduced || event.metaKey || event.ctrlKey) return;
    event.preventDefault();
    document.querySelector("dialog[open]")?.close();
    fillCurtain(target);
    sessionStorage.setItem("mock:nav", "1");
    root.dataset.curtain = "";
    setTimeout(() => (location.href = target.href), 800);
  });
}

function wireChrome() {
  const menu = document.querySelector(".menu-layer");
  document.querySelector("[data-open-menu]").addEventListener("click", () => menu.showModal());
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-close]")) event.target.closest("dialog").close();
  });
  document.querySelector("[data-copy]").addEventListener("click", () => {
    const label = document.querySelector("[data-mail-label]");
    navigator.clipboard?.writeText(EMAIL).catch(() => {});
    label.textContent = "Copiado";
    setTimeout(() => (label.textContent = "Correo"), 2000);
  });
}

renderChrome();
startClock();
wireCurtain();
wireChrome();
