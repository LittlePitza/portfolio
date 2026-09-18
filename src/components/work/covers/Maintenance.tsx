import frame from "./plate.module.css";
import s from "./maintenance.module.css";
import { poppins } from "./fonts";
import { Icon } from "./icons";

/** The maintenance portal: a work order filed from a phone on the shop floor, the order as the team receives it, and the machine it is about. */
export function Maintenance() {
  return (
    <div className={`${s.root} ${poppins.className}`}>
      <div className={`${frame.frag} ${s.phone}`}>
        <span className={s.island} />
        <span className={s.appBar}>
          <b>Nueva OT</b>
          <span className={s.bell}>
            <Icon name="bell" />
          </span>
        </span>
        <span className={s.form}>
          <span className={s.eyebrow}>Mantenimiento</span>
          <span className={s.title}>Nueva orden de trabajo</span>
          <Label text="Área" required />
          <span className={s.input}>Inyección · Línea 3</span>
          <Label text="Tipo de actividad" required />
          <span className={s.segmented}>
            <span className={s.on}>Correctivo</span>
            <span>Preventivo</span>
            <span>Otro</span>
          </span>
          <Label text="Nivel de preponderancia" required />
          <span className={s.levels}>
            <span>Importante</span>
            <span className={s.urgent}>Urgente</span>
            <span>Crítico</span>
          </span>
          <Label text="Evidencia (foto / video)" />
          <span className={s.drop}>
            <Icon name="image" />
            <span>Toca para agregar</span>
          </span>
          <span className={s.send}>Enviar orden</span>
        </span>
        <span className={s.tabs}>
          <span className={s.tabOn}>
            <Icon name="plus" />
            Nueva OT
          </span>
          <span>
            <Icon name="list" />
            Mis solicitudes
          </span>
          <span>
            <Icon name="grid" />
            Panel
          </span>
        </span>
      </div>

      <div className={`${frame.frag} ${s.order}`}>
        <span className={s.orderHead}>
          <b>OT-0147</b>
          <span className={s.pill}>
            <span>Recibida</span>
            <span>En proceso</span>
          </span>
        </span>
        <span className={s.orderBody}>
          <span className={s.area}>Inyección · Línea 3</span>
          <span className={s.description}>Ruido fuerte en el motor al arrancar; se detiene a los pocos minutos.</span>
          <span className={s.chips}>
            <span>Correctivo</span>
            <span>Planta Norte</span>
            <span>Molino #13</span>
          </span>
          <span className={s.row}>
            <span className={s.priority}>Urgente</span>
            <span className={s.files}>
              <Icon name="clip" />2 archivos
            </span>
          </span>
          <span className={s.requester}>
            <span className={s.avatar}>MR</span>
            <span>
              <b>Mario Ruiz</b>
              <small>Solicitante · ahora</small>
            </span>
          </span>
        </span>
      </div>

      <div className={`${frame.frag} ${s.machine}`}>
        <span className={s.machineTop}>
          <span className={s.badge}>M13</span>
          <span className={s.machineName}>
            <b>MOLINO #13</b>
            <small>Planta Norte</small>
          </span>
          <span className={s.operative}>Operativa</span>
        </span>
        <span className={s.next}>
          Próximo: <b>2 oct · Preventivo</b>
        </span>
      </div>
    </div>
  );
}

function Label({ text, required = false }: { text: string; required?: boolean }) {
  return (
    <span className={s.label}>
      {text} {required && <i>*</i>}
    </span>
  );
}
