import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { site } from "@/content/site";
import { ContactCards } from "@/components/contact/ContactCards";
import { ContactEmail } from "@/components/contact/ContactEmail";
import { PageTitle } from "@/components/ui/PageTitle";
import { enterStep } from "@/components/ui/enterStep";
import { localizedPageMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const t = getDictionary(locale);
  return localizedPageMetadata({
    locale,
    path: "/contact",
    title: t.contact.title,
    description: t.contact.description.replace("{name}", site.name),
  });
}

/**
 * Contact (section 6.3). On the stage one viewport: the title on top left, the address
 * anchored to the bottom left and the four cards on columns 5 to 8. Below the stage it
 * stacks in that order and scrolls.
 */
export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <article
      data-fit
      className="page-grid gap-y-8 pt-8 pb-12
        stage:grid-rows-[auto_minmax(0,1fr)_auto] stage:gap-y-4 stage:pt-4 stage:pb-4"
    >
      <div className="col-span-4 stage:col-span-3 stage:row-start-1">
        <PageTitle>{t.contact.title}</PageTitle>
      </div>

      <div
        data-enter
        style={enterStep(1)}
        className="col-span-4 stage:row-start-3 stage:self-end"
      >
        <ContactEmail
          email={site.email}
          labels={{
            lead: t.contact.lead,
            copy: t.contact.copy,
            copied: t.contact.copied,
            failed: t.frame.copyFailed,
            mailto: t.contact.mailto,
          }}
        />
      </div>

      <div
        data-enter
        style={enterStep(2)}
        className="col-span-4 stage:col-start-5 stage:row-span-3 stage:row-start-1 stage:min-h-0"
      >
        <ContactCards locale={locale} t={t} className="h-full" />
      </div>
    </article>
  );
}
