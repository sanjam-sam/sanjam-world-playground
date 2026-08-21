/**
 * Photo gallery slots.
 *
 * To use a real photo: drop the file in `src/assets/`, import it at the top of
 * this file, and set `src` on the matching slot. Leave `src` undefined and the
 * card renders a styled placeholder instead — nothing breaks.
 */
export type Photo = {
  id: string;
  title: string;
  caption: string;
  /** Optional imported image. Undefined renders a placeholder card. */
  src?: string;
  /** Describe the photo for screen readers once a real image is added. */
  alt?: string;
  /** Card shape in the masonry grid. */
  shape?: "tall" | "wide" | "square";
};

export const photos: Photo[] = [
  {
    id: "01",
    title: "Golden hour rooftop",
    caption: "The first evening the city looked like it was on my side.",
    shape: "tall",
  },
  { id: "02", title: "Late-night desk", caption: "Where most of this was built.", shape: "wide" },
  { id: "03", title: "Mountain detour", caption: "Wrong turn, better view.", shape: "square" },
  { id: "04", title: "Street food run", caption: "Nine rupees of pure joy.", shape: "square" },
  { id: "05", title: "Rain on glass", caption: "Monsoon, from the dry side.", shape: "tall" },
  { id: "06", title: "Friends, blurry", caption: "Nobody stood still. Perfect.", shape: "wide" },
  { id: "07", title: "Neon alley", caption: "Colours I keep trying to recreate in CSS.", shape: "square" },
  { id: "08", title: "Morning chai", caption: "The actual project dependency.", shape: "square" },
];
