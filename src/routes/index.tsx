import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Camera, MessageSquareHeart, Gamepad2, FolderKanban } from "lucide-react";
import { Particles } from "@/components/site/Particles";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sanjam World — Photos, Thoughts, Projects & Games" },
      {
        name: "description",
        content:
          "The personal world of Sanjam: a photo gallery, a public thoughts wall, project portfolio and a playground of browser games.",
      },
      { property: "og:title", content: "Sanjam World — A warm corner of the internet" },
      {
        property: "og:description",
        content:
          "Photos, thoughts, projects and playable games — all in one hand-built personal site.",
      },
    ],
  }),
  component: Home,
});

const highlights = [
  {
    to: "/gallery",
    label: "Gallery",
    icon: Camera,
    copy: "Frames from everyday life, waiting for the next roll of photos.",
  },
  {
    to: "/thoughts",
    label: "Thoughts Wall",
    icon: MessageSquareHeart,
    copy: "Leave a note. Read what other visitors left behind.",
  },
  {
    to: "/projects",
    label: "Projects",
    icon: FolderKanban,
    copy: "Things built, things breaking, things still only an idea.",
  },
  {
    to: "/playground",
    label: "Playground",
    icon: Gamepad2,
    copy: "Guess the Number and Tic-Tac-Toe — playable right now.",
  },
] as const;

function Home() {
  return (
    <>
      <section className="aurora relative overflow-hidden">
        <div
          aria-hidden="true"
          className="grid-veil pointer-events-none absolute inset-0 opacity-50"
        />
        <Particles />
        <div className="relative mx-auto max-w-6xl px-5 pt-14 pb-20 md:pt-24 md:pb-28">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              Welcome in
            </p>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-6 max-w-3xl text-5xl leading-[0.95] font-bold sm:text-6xl md:text-7xl">
              This is <span className="text-gradient">Sanjam World</span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground md:text-xl">
              Part photo album, part open notebook, part arcade. Everything here is hand-built,
              a little playful, and always mid-renovation — wander around.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/gallery"
                className="glow-ring group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
              >
                Explore the gallery
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
              <Link
                to="/playground"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-3 text-sm font-semibold transition-colors hover:bg-secondary"
              >
                Play a game
              </Link>
            </div>
          </Reveal>

          <div
            aria-hidden="true"
            className="animate-float pointer-events-none absolute top-24 -right-16 hidden size-72 rounded-full opacity-40 blur-2xl md:block"
            style={{ background: "var(--gradient-warm)" }}
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-6" aria-labelledby="explore-heading">
        <Reveal>
          <h2 id="explore-heading" className="font-display text-2xl font-bold md:text-3xl">
            Four doors in
          </h2>
        </Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item, index) => (
            <Reveal key={item.to} delay={index * 80}>
              <Link
                to={item.to}
                className="surface-card group flex h-full flex-col rounded-3xl p-6 transition-transform hover:-translate-y-1.5"
              >
                <span className="grid size-11 place-items-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/25">
                  <item.icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">{item.label}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.copy}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Open
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-16" aria-labelledby="about-heading">
        <Reveal>
          <div className="surface-card relative overflow-hidden rounded-4xl p-8 md:p-12">
            <div
              aria-hidden="true"
              className="absolute -top-24 -left-16 size-64 rounded-full opacity-30 blur-3xl"
              style={{ background: "var(--gradient-warm)" }}
            />
            <h2 id="about-heading" className="relative font-display text-3xl font-bold md:text-4xl">
              Hi, I&apos;m Sanjam
            </h2>
            <p className="relative mt-4 max-w-2xl text-muted-foreground md:text-lg">
              I build small things on the web, take more photos than I ever post, and think out loud
              a lot. This site collects all of that in one place instead of scattering it across
              five apps. If something here made you smile, the Thoughts Wall is right there.
            </p>
            <div className="relative mt-7 flex flex-wrap gap-2">
              {["Builder", "Photographer-ish", "Chai-powered", "Game night regular"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border/70 bg-background/50 px-3 py-1 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
