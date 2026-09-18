import frame from "./plate.module.css";
import s from "./vault.module.css";
import { Icon, type IconName } from "./icons";

/**
 * Password Vault: the popup as it opens from the toolbar, the envelope scheme
 * from its README (two keys wrap one data key, so changing the master password
 * never re-encrypts the vault), and the copy notice whose bar drains while the
 * clipboard waits to be cleared.
 */
export function PasswordVault() {
  return (
    <div className={s.root}>
      <div className={`${frame.frag} ${s.scheme}`}>
        <span className={s.eyebrow}>Modelo de seguridad</span>
        <span className={s.diagram}>
          <span className={s.source}>Contraseña maestra</span>
          <span className={s.source}>Código de respaldo</span>
          <span className={s.derive}>scrypt</span>
          <span className={s.derive}>scrypt</span>
          <span className={s.kek}>KEK-maestra</span>
          <span className={s.kek}>KEK-respaldo</span>
          <span className={s.merge}>
            <span>AES-GCM</span>
          </span>
          <span className={s.dek}>DEK</span>
          <span className={s.items}>
            <span>item</span>
            <span>item</span>
            <span>item</span>
          </span>
        </span>
        <span className={s.params}>scrypt · N=2¹⁷ r=8 p=2 · AES-256-GCM</span>
      </div>

      <div className={`${frame.frag} ${s.popup}`}>
        <span className={s.header}>
          <b>Bóveda</b>
          <Icon name="moon" />
          <Icon name="lock" />
        </span>
        <span className={s.search}>
          <Icon name="search" />
          Buscar…
        </span>
        <span className={s.panel}>
          <span className={s.tabs}>
            <span className={s.tabOn}>Todo</span>
            <span>Logins</span>
            <span>Notas</span>
            <span>Tarjetas</span>
          </span>
          <span className={s.group}>Favoritos</span>
          <Row icon="key" title="GitHub" subtitle="ana@correo.com" favourite live />
          <span className={s.group}>Todos</span>
          <Row icon="key" title="Banco Norte" subtitle="ana.lopez" />
          <Row icon="note" title="Claves del router" subtitle="Nota segura" kind="note" />
          <Row icon="card" title="Tarjeta de la empresa" subtitle="•••• 4821" kind="card" />
          <span className={s.footer}>
            <Icon name="shield" />
            <span className={s.new}>
              <Icon name="add" />
              Nuevo
            </span>
          </span>
        </span>
      </div>

      <div className={`${frame.frag} ${s.toast}`}>
        <span className={s.toastText}>
          <Icon name="check" />
          Usuario copiado. Se borrará en 30 s.
        </span>
        <span className={s.drain} />
      </div>
    </div>
  );
}

function Row({
  icon,
  title,
  subtitle,
  kind = "login",
  favourite = false,
  live = false,
}: {
  icon: IconName;
  title: string;
  subtitle: string;
  kind?: "login" | "note" | "card";
  favourite?: boolean;
  live?: boolean;
}) {
  return (
    <span className={`${s.row} ${live ? s.live : ""}`}>
      <span className={`${s.chip} ${s[kind]}`}>
        <Icon name={icon} />
      </span>
      <span className={s.rowText}>
        <span className={s.rowTitle}>
          {favourite && <Icon name="star" className={s.star} />}
          {title}
        </span>
        <span className={s.rowSub}>{subtitle}</span>
      </span>
      {kind === "login" && (
        <span className={s.copy}>
          <Icon name="user" />
          <Icon name="key" />
        </span>
      )}
    </span>
  );
}
