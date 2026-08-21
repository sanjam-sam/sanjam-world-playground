import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, FolderKanban } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { projects, type Project } from "@/data/projects";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Sanjam World" },
      {
        name: "description",
        content:
          "A portfolio of things Sanjam has built, is building, or is still only dreaming about — from this site to a mini arcade.",
      },
      { property: "og:title", content: "Projects — Sanjam World" },
      {
        property: "og:description",
        content: "Shipped work, work in progress and concepts from Sanjam World.",
      },
    ],
  }),
  component: ProjectsPage,
});

const statusClass: Record<Project["status"], string> = {
  Live: "bg-aqua/15 text-aqua",
  "In progress": "bg-primary/15 text-primary",
  Concept: "bg-accent/15 text-accent",
};

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const isInternal = project.href?.startsWith("/");

  return (
    <Reveal delay={(index % 3) * 80}>
      <article className="surface-card flex h-full flex-col rounded-3xl p-6 transition-transform hover:-translate-y-1.5">
        <div className="flex items-center justify-between gap-3">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold",
              statusClass[project.status],
            )}
          >
            {project.status}
          </span>
          <span className="text-xs text-muted-foreground">{project.year}</span>
        </div>

        <h2 className="mt-4 font-display text-xl font-bold">{project.title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{project.blurb}</p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-border/70 bg-background/50 px-2.5 py-1 text-xs text-muted-foreground"
            >
              {tag}
            </li>
          ))}
        </ul>

        {project.href && isInternal ? (
          <Link
            to={project.href}
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            Visit <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        ) : project.href ? (
          <a
            href={project.href}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            Visit <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        ) : (
          <span className="mt-6 text-sm text-muted-foreground">Write-up coming soon</span>
        )}
      </article>
    </Reveal>
  );
}

function ProjectsPage() {
  return (
    <>
      <PageHeader eyebrow="Projects" title="Built, building, dreaming">
        <p>
          A running list of what I&apos;m making. Some of it is live on this very site; some is
          still a sketch in a notebook.
        </p>
      </PageHeader>

      <section className="mx-auto max-w-6xl px-5 pb-8" aria-label="Project list">
        {projects.length === 0 ? (
          <Reveal>
            <div className="surface-card rounded-3xl border-dashed p-10 text-center">
              <FolderKanban className="mx-auto size-6 text-primary" aria-hidden="true" />
              <h2 className="mt-4 font-display text-xl font-semibold">Nothing published yet</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                The first project write-ups are on their way.
              </p>
            </div>
          </Reveal>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}

        <Reveal>
          <p className="mt-8 rounded-2xl border border-dashed border-border/70 bg-card/40 p-5 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Adding a project later:</span> every
            card comes from one editable list — title, blurb, status badge, year, tags and an
            optional link. Add an entry and it appears here instantly.
          </p>
        </Reveal>
      </section>
    </>
  );
}
