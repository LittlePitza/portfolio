import frame from "./plate.module.css";
import s from "./marketplace.module.css";
import { spaceGrotesk } from "./fonts";
import { Icon } from "./icons";

/**
 * The marketplace: the storefront's promise, a resin's volume tiers with the
 * total the database works out, and the SPEI checkout. Nothing a buyer types
 * sets a price, which is the story of the audit behind it.
 */
export function Marketplace() {
  return (
    <div className={s.root}>
      <div className={`${frame.frag} ${s.store}`}>
        <span className={s.nav}>
          <span className={s.search}>
            <Icon name="search" />
            Buscar resina, grado o SKU…
          </span>
          <span className={s.cart}>
            <Icon name="cart" />
            Carrito
          </span>
          <span className={s.login}>Ingresar</span>
        </span>
        <span className={s.hero}>
          <span className={s.eyebrow}>Marketplace industrial · México</span>
          <span className={`${s.headline} ${spaceGrotesk.className}`}>Resina reciclada verificada, con precio y entrega en México.</span>
          <span className={s.lead}>Ficha técnica, escala de precio por volumen y COA por lote.</span>
          <span className={s.ctas}>
            <span className={s.primary}>Ver catálogo</span>
            <span className={s.secondary}>Vender en el mercado</span>
          </span>
          <span className={s.stats}>
            <Stat label="Familias" value="12" />
            <Stat label="Precio publicado" value="MXN/kg" />
            <Stat label="Factura" value="CFDI 4.0" />
          </span>
        </span>
      </div>

      <div className={`${frame.frag} ${s.tiers}`}>
        <span className={`${s.product} ${spaceGrotesk.className}`}>PEAD soplado · natural</span>
        <span className={s.sku}>Molido · MFI 0.3 · lote 2609</span>
        <span className={s.eyebrow}>Escalas por volumen</span>
        <span className={s.table}>
          <span className={s.headRow}>
            <span>Volumen</span>
            <span>Precio / kg + IVA</span>
            <span>Ahorro</span>
          </span>
          <Tier volume="Desde 1,000 kg (MOQ)" price="$24.80" saving="—" />
          <Tier volume="Desde 5,000 kg" price="$23.10" saving="−7 %" className={s.now} />
          <Tier volume="Desde 20,000 kg" price="$21.90" saving="−12 %" className={s.next} />
        </span>
        <span className={s.total}>
          <span>Total estimado</span>
          <span className={s.amounts}>
            <span>$133,980.00</span>
            <span>$508,080.00</span>
          </span>
        </span>
      </div>

      <div className={`${frame.frag} ${s.pay}`}>
        <span className={s.eyebrow}>2 · Método de pago</span>
        <span className={s.method}>
          <span className={s.radio} />
          Transferencia bancaria (SPEI)
        </span>
        <span className={s.note}>Tu pedido queda apartado como pendiente de pago.</span>
        <span className={s.confirm}>Confirmar pedido</span>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <span>
      <span className={s.statLabel}>{label}</span>
      <span className={s.statValue}>{value}</span>
    </span>
  );
}

function Tier({ volume, price, saving, className = "" }: { volume: string; price: string; saving: string; className?: string }) {
  return (
    <span className={`${s.tier} ${className}`}>
      <span>
        {volume} <b>Tu cantidad</b>
      </span>
      <span>{price}</span>
      <span>{saving}</span>
    </span>
  );
}
