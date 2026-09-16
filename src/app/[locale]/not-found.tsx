import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-svh flex-col items-center justify-center px-4 text-center">
      <p className="display text-[20vw] leading-none text-accent">404</p>
      <Link href="/" className="link-draw label mt-6">
        ← Home
      </Link>
    </section>
  );
}
