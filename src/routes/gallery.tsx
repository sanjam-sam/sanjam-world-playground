import { createFileRoute } from "@tanstack/react-router";
import { ImagePlus, Camera } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { photos, type Photo } from "@/data/gallery";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Photo Gallery — Sanjam World" },
      {
        name: "description",
        content:
          "A growing photo gallery from Sanjam World: golden hours, late-night desks, street food runs and everything between.",
      },
      { property: "og:title", content: "Photo Gallery — Sanjam World" },
      {
        property: "og:description",
        content: "A growing collection of frames from everyday life in Sanjam World.",
      },
    ],
  }),
  component: GalleryPage,
});

const shapeClass: Record<NonNullable<Photo["shape"]>, string> = {
  tall: "sm:row-span-2 aspect-[3/4] sm:aspect-auto sm:min-h-[26rem]",
  wide: "sm:col-span-2 aspect-[16/10]",
  square: "aspect-square",
};

function PhotoCard({ photo, index }: { photo: Photo; index: number }) {
  return (
    <Reveal delay={(index % 4) * 70} className={cn(shapeClass[photo.shape ?? "square"])}>
      <figure className="surface-card group relative h-full w-full overflow-hidden rounded-3xl">
        {photo.src ? (
          <img
            src={photo.src}
            alt={photo.alt ?? photo.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center"
            role="img"
            aria-label={`Placeholder for a photo titled ${photo.title}`}
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-25 transition-opacity duration-500 group-hover:opacity-40"
              style={{ background: "var(--gradient-warm)" }}
            />
            <span className="relative grid size-12 place-items-center rounded-2xl bg-background/70 text-primary ring-1 ring-primary/30">
              <Camera className="size-5" aria-hidden="true" />
            </span>
            <span className="relative font-display text-xs font-semibold tracking-[0.2em] text-foreground/80 uppercase">
              Photo {photo.id}
            </span>
          </div>
        )}

        <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/70 to-transparent p-4 pt-10">
          <p className="font-display text-sm font-semibold">{photo.title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{photo.caption}</p>
        </figcaption>
      </figure>
    </Reveal>
  );
}

function GalleryPage() {
  return (
    <>
      <PageHeader eyebrow="Gallery" title="Frames from Sanjam World">
        <p>
          These slots are ready for real photos. Until they land, each card shows a styled
          placeholder so the wall never looks broken or empty.
        </p>
      </PageHeader>

      <section className="mx-auto max-w-6xl px-5 pb-8" aria-label="Photo gallery">
        {photos.length === 0 ? (
          <Reveal>
            <div className="surface-card rounded-3xl border-dashed p-10 text-center">
              <ImagePlus className="mx-auto size-6 text-primary" aria-hidden="true" />
              <h2 className="mt-4 font-display text-xl font-semibold">No photos yet</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                The first roll is still being picked. Check back soon.
              </p>
            </div>
          </Reveal>
        ) : (
          <div className="grid auto-rows-[minmax(0,auto)] grid-cols-1 gap-4 sm:grid-cols-3">
            {photos.map((photo, index) => (
              <PhotoCard key={photo.id} photo={photo} index={index} />
            ))}
          </div>
        )}

        <Reveal>
          <p className="mt-8 rounded-2xl border border-dashed border-border/70 bg-card/40 p-5 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Adding a photo later:</span> drop the
            image into the project&apos;s assets folder, import it in the gallery data file, and set
            it on the matching card. Titles, captions and card shapes all live in that one list.
          </p>
        </Reveal>
      </section>
    </>
  );
}
