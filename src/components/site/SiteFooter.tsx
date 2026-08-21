import { Link } from "@tanstack/react-router";
import { Sparkles, Heart } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-border/60">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 h-48 opacity-50 blur-3xl"
        style={{ background: "var(--gradient-warm)" }}
      />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <p className="inline-flex items-center gap-2 font-display text-lg font-bold">
            <Sparkles className="size-4 text-primary" aria-hidden="true" />
            <span className="text-gradient">Sanjam World</span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            A small warm corner of the internet — photos, thoughts, projects and a few games worth
            losing five minutes to.
          </p>
        </div>

        <nav aria-label="Footer" className="text-sm">
          <h2 className="font-display text-sm font-semibold tracking-wide uppercase">Explore</h2>
          <ul className="mt-3 grid gap-2">
            {[
              { to: "/gallery", label: "Photo gallery" },
              { to: "/thoughts", label: "Thoughts wall" },
              { to: "/projects", label: "Projects" },
              { to: "/playground", label: "Playground" },
            ].map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="text-sm">
          <h2 className="font-display text-sm font-semibold tracking-wide uppercase">Say hello</h2>
          <p className="mt-3 text-muted-foreground">
            Leave a note on the Thoughts Wall — it is the fastest way to reach me.
          </p>
          <Link
            to="/thoughts"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            Write a thought
          </Link>
        </div>
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-2 border-t border-border/60 px-5 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Sanjam World. All rights reserved.</p>
        <p className="inline-flex items-center gap-1.5">
          Built with <Heart className="size-3.5 text-accent" aria-hidden="true" /> and far too much
          chai.
        </p>
      </div>
    </footer>
  );
}
