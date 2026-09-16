/** Full-bleed black opener with a giant serif title, the huyml "ABOUT" moment. */
export function PageHeader({ title, kicker, children }: { title: string; kicker?: string; children?: React.ReactNode }) {
  return (
    <header className="flex min-h-[70svh] flex-col justify-end bg-ink px-4 pb-10 pt-32 text-bg md:px-6 md:pb-14">
      {kicker && <p className="label mb-4 text-bg/60">{kicker}</p>}
      <h1 className="display text-[clamp(3.5rem,14vw,14rem)]">{title}</h1>
      {children}
    </header>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="label mb-8 text-muted">{children}</h2>;
}
