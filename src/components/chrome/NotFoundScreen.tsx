import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { CurtainLink } from "./Curtain";
import { IncidentReport } from "./IncidentReport";
import { StageShell } from "./StageShell";
import { enterStep } from "@/components/ui/enterStep";

const EXIT = "block min-h-11 font-display text-heading stage:min-h-0";

/**
 * The 404 (section 6.6), in screen mode: the incident report on top left, the big 404
 * below it and two ways out on columns 5 to 8. Two routes render it, see
 * app/[locale]/[...rest]/page.tsx and app/[locale]/not-found.tsx.
 */
export function NotFoundScreen({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <StageShell locale={locale}>
      <section
        data-fit
        className="page-grid gap-y-12 pt-8 pb-12
          stage:grid-rows-[auto_minmax(0,1fr)_auto] stage:gap-y-4 stage:pt-4 stage:pb-4"
      >
        <div data-enter style={enterStep(1)} className="col-span-4 stage:col-span-3 stage:row-start-1">
          <IncidentReport labels={t.notFound} />
        </div>

        <h1
          data-enter
          style={enterStep(0)}
          className="col-span-4 font-display text-display stage:col-span-4 stage:row-start-3 stage:self-end"
        >
          404
        </h1>

        <div
          data-enter
          data-siblings
          style={enterStep(2)}
          className="col-span-4 grid content-start justify-items-start gap-2
            stage:col-span-4 stage:col-start-5 stage:row-start-3 stage:self-end stage:pb-4"
        >
          <CurtainLink href={`/${locale}`} label={t.nav.work} className={EXIT}>
            {t.notFound.home}
          </CurtainLink>
          <CurtainLink href={`/${locale}/work`} label={t.nav.index} className={EXIT}>
            {t.notFound.index}
          </CurtainLink>
        </div>
      </section>
    </StageShell>
  );
}
