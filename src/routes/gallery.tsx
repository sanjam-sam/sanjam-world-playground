import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ImagePlus, Camera } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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

function PhotoCard({
  photo,
  index,
  onOpen,
}: {
  photo: Photo;
  index: number;
  onOpen: (photo: Photo) => void;
}) {
  const hasImage = Boolean(photo.src);

  const inner = (
    <figure className="surface-card group relative h-full w-full overflow-hidden rounded-3xl">
      {photo.src ? (
        <img
          src={photo.src}
          alt={photo.alt ?? photo.title}
          loading={index < 3 ? "eager" : "lazy"}
          fetchPriority={index === 0 ? "high" : "auto"}
          decoding="async"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
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

      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/70 to-transparent p-4 pt-10 text-left">
        <p className="font-display text-sm font-semibold">{photo.title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{photo.caption}</p>
      </figcaption>
    </figure>
  );

  return (
    <Reveal delay={(index % 4) * 70} className={cn(shapeClass[photo.shape ?? "square"])}>
      {hasImage ? (
        <button
          type="button"
          onClick={() => onOpen(photo)}
          aria-label={`Open ${photo.title} full size`}
          className="block h-full w-full rounded-3xl transition-transform hover:-translate-y-0.5"
        >
          {inner}
        </button>
      ) : (
        inner
      )}
    </Reveal>
  );
}

function GalleryPage() {
  const [active, setActive] = useState<Photo | null>(null);

  return (
    <>
      <PageHeader eyebrow="Gallery" title="Frames from Sanjam World">
        <p>
          Real frames from real days — cafés, cedar ceilings and mountain lakes. Tap any photo to
          see it full size.
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
              <PhotoCard key={photo.id} photo={photo} index={index} onOpen={setActive} />
            ))}
          </div>
        )}

        <Reveal>
          <p className="mt-8 rounded-2xl border border-dashed border-border/70 bg-card/40 p-5 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Adding a photo later:</span> upload the
            image, import it in the gallery data file, and set it on the matching card. Titles,
            captions and card shapes all live in that one list.
          </p>
        </Reveal>
      </section>

      <Dialog open={active !== null} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="max-w-3xl border-border/70 bg-background/95 p-3 sm:p-4">
          {active ? (
            <>
              <DialogTitle className="sr-only">{active.title}</DialogTitle>
              <DialogDescription className="sr-only">{active.caption}</DialogDescription>
              <img
                src={active.src}
                alt={active.alt ?? active.title}
                decoding="async"
                className="max-h-[75vh] w-full rounded-2xl object-contain"
              />
              <div className="px-1 pb-1 text-center">
                <p className="font-display text-base font-semibold">{active.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{active.caption}</p>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

