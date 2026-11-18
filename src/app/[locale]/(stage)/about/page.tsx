import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { capabilities, experience, facts, figures, process } from "@/content/profile";
import { headItems } from "@/content/head";
import { AboutColumns, type AboutColumn } from "@/components/about/AboutColumns";
import { CapabilitiesLayer } from "@/components/about/CapabilitiesLayer";
import { InsideHead } from "@/components/about/InsideHead";
import { JourneyLayer } from "@/components/about/JourneyLayer";
import { ProcessLayer } from "@/components/about/ProcessLayer";
import { formatYears } from "@/components/about/dates";
import { Figure } from "@/components/ui/Figure";
import { PageTitle } from "@/components/ui/PageTitle";
import { enterStep } from "@/components/ui/enterStep";
import { localizedPageMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const t = getDictionary(locale);
  return localizedPageMetadata({ locale, path: "/about", title: t.about.title, description: t.about.intro });
}

/**
 * About (section 6.2). On the stage one viewport: title and statement on top, the portrait
 * in the middle with a figure on each side, the four lists along the bottom. Below the stage
 * it stacks and scrolls. The three layers open from the lists' headings.
 */
export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const t = getDictionary(locale);
  const anchors = t.about.anchors;
  const openLabel = (name: string) => t.about.open.replace("{name}", name);

  const columns: AboutColumn[] = [
    { title: t.about.facts, rows: facts[locale].map((text) => ({ text })) },
    {
      title: t.about.capabilitiesShort,
      layer: { id: anchors.capabilities, label: openLabel(t.about.capabilitiesShort) },
      rows: capabilities.map((capability) => ({ text: capability.title[locale] })),
    },
    {
      title: t.about.journey,
      layer: { id: anchors.journey, label: openLabel(t.about.journey) },
      rows: experience.map((role) => ({
        text: role.company,
        aside: formatYears(role.from, role.to, t.about.now),
      })),
    },
    {
      title: t.about.process,
      layer: { id: anchors.process, label: openLabel(t.about.process) },
      rows: process[locale].map((item) => ({ text: `${item.step} ${item.title}` })),
    },
  ];

  return (
    <article data-fit>
      <div
        className="page-grid gap-y-8 pt-8 pb-12 [--text-figure:20vw]
          stage:h-full stage:grid-rows-[auto_minmax(0,1fr)_auto] stage:gap-y-4 stage:pt-4 stage:pb-4
          stage:[--text-figure:min(11vw,20svh)]"
      >
        <div data-head-dim className="col-span-4 stage:col-span-3 stage:row-start-1">
          <PageTitle>{t.about.title}</PageTitle>
        </div>

        <div data-head-dim className="col-span-4 stage:col-span-3 stage:col-start-6 stage:row-start-1">
          <p data-enter style={enterStep(1)} className="max-w-[30ch] text-lead text-accent stage:max-w-none">
            {t.about.statement}
          </p>
        </div>

        <div
          data-enter
          style={enterStep(2)}
          className="col-span-4 stage:col-span-2 stage:col-start-4 stage:row-span-2 stage:row-start-1
            stage:min-h-0"
        >
          <InsideHead
            items={headItems.map((item) => ({
              icon: item.icon,
              title: item.title[locale],
              story: item.story[locale],
              signature: item.signature[locale],
            }))}
            question={t.about.headQuestion}
            hintOpen={t.about.headHintOpen}
            openLabel={t.about.headOpen}
            close={t.about.close}
          />
        </div>

        {figures.map((figure, index) => (
          <div
            key={figure.value}
            data-head-dim
            className={`col-span-2 stage:row-start-2 stage:self-end ${
              index === 0 ? "stage:col-start-1" : "stage:col-start-7 stage:text-right"
            }`}
          >
            <div data-enter style={enterStep(3)}>
              <Figure
                value={figure.value}
                label={figure.label[locale]}
                className={`flex-col gap-2! stage:gap-1! ${index === 0 ? "" : "stage:items-end"}`}
                labelClassName="text-muted"
              />
            </div>
          </div>
        ))}

        <div data-head-dim className="col-span-4 stage:col-span-8 stage:row-start-3">
          <AboutColumns columns={columns} />
        </div>
      </div>

      <CapabilitiesLayer
        id={anchors.capabilities}
        title={t.about.capabilitiesShort}
        closeLabel={t.about.close}
        locale={locale}
      />
      <JourneyLayer
        id={anchors.journey}
        title={t.about.journey}
        closeLabel={t.about.close}
        locale={locale}
        labels={t.about}
      />
      <ProcessLayer id={anchors.process} title={t.about.process} closeLabel={t.about.close} locale={locale} />
    </article>
  );
}
