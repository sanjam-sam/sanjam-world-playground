import cafePortrait from "@/assets/IMG_4203.jpg";
import indoorPortrait from "@/assets/FullSizeRender.jpg";
import lakeBoat from "@/assets/IMG_2480.jpg";
import sunsetPark from "@/assets/sunset-park.jpg";
import corbettJeep from "@/assets/corbett-jeep.jpg";
import hillRide from "@/assets/hill-ride.jpg";
import teakWall from "@/assets/teak-wall.jpg";
import cliffView from "@/assets/cliff-view.jpg";
import pineRidge from "@/assets/pine-ridge.jpg";

/**
 * Photo gallery slots.
 *
 * To use a real photo: upload it as a CDN asset, import the pointer at the top
 * of this file, and set `src` on the matching slot. Leave `src` undefined and
 * the card renders a styled placeholder instead — nothing breaks.
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
    title: "Coffee-shop pause",
    caption: "Wood grain, warm lamps and one more message before the day starts.",
    src: cafePortrait,
    alt: "Sanjam standing in a wood-panelled cafe, reading his phone under warm lamps.",
    shape: "tall",
  },
  {
    id: "02",
    title: "Cedar-lit evening",
    caption: "Sweater on the shoulders, cedar ceiling overhead, nowhere to rush.",
    src: indoorPortrait,
    alt: "Sanjam in a brown long-sleeve tee with a cream sweater over his shoulders, under a cedar ceiling.",
    shape: "square",
  },
  {
    id: "03",
    title: "Nainital, mid-lake",
    caption: "Hills on both sides, yellow oars, and the quietest hour of the trip.",
    src: lakeBoat,
    alt: "Sanjam sitting in a yellow rowing boat on a mountain lake with forested hills behind him.",
    shape: "tall",
  },
  {
    id: "04",
    title: "Sunset by the fountains",
    caption: "Last light over the water, jacket half on, nowhere else to be.",
    src: sunsetPark,
    alt: "Sanjam sitting on a stone ledge by a reflecting pool as the sun sets behind trees.",
    shape: "tall",
  },
  {
    id: "05",
    title: "Corbett, gate 233",
    caption: "Open-top Gypsy, tall sal trees, and a whole reserve ahead.",
    src: corbettJeep,
    alt: "Sanjam leaning against a green open-top safari jeep parked under tall green trees.",
    shape: "square",
  },
  {
    id: "06",
    title: "Hunter on the hill road",
    caption: "Cut rock on one side, cold air on the other.",
    src: hillRide,
    alt: "Sanjam sitting on a black Royal Enfield motorcycle beside a rocky mountain roadside.",
    shape: "tall",
  },
  {
    id: "07",
    title: "Teak block wall",
    caption: "Thousands of little squares and one very slow afternoon.",
    src: teakWall,
    alt: "Sanjam in a mint shirt standing in front of a wall of stacked teak wood blocks.",
    shape: "tall",
  },
  {
    id: "08",
    title: "Edge of the deodars",
    caption: "Storm rolling in over the pines, so obviously we stayed.",
    src: cliffView,
    alt: "Sanjam standing on a rock at a cliff edge overlooking pine-covered hills under grey clouds.",
    shape: "tall",
  },
  {
    id: "09",
    title: "Pine ridge, blue sky",
    caption: "Clear day, gravel path, and the good kind of tired.",
    src: pineRidge,
    alt: "Sanjam standing on a gravel ridge between tall pine trees with hills in the distance.",
    shape: "square",
  },
  { id: "10", title: "Late-night desk", caption: "Where most of this was built.", shape: "square" },
  { id: "11", title: "Morning chai", caption: "The actual project dependency.", shape: "square" },
];

