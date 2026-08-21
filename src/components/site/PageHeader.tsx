import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="aurora relative overflow-hidden">
      <div
        aria-hidden="true"
        className="grid-veil pointer-events-none absolute inset-0 opacity-40"
      />
      <div className="relative mx-auto max-w-6xl px-5 pt-16 pb-10 md:pt-24 md:pb-14">
        <Reveal>
          <p className="inline-flex items-center rounded-full border border-border/70 bg-card/60 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            {eyebrow}
          </p>
          <h1 className="mt-5 text-4xl font-bold md:text-6xl">
            <span className="text-gradient">{title}</span>
          </h1>
          {children ? (
            <div className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
              {children}
            </div>
          ) : null}
        </Reveal>
      </div>
    </div>
  );
}
