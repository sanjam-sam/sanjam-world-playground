/**
 * Projects shown on /projects.
 *
 * To add or edit a project, just edit this list — nothing else to touch.
 * `status` controls the badge, `tags` render as chips, `href` is optional.
 */
export type Project = {
  id: string;
  title: string;
  blurb: string;
  status: "Live" | "In progress" | "Concept";
  year: string;
  tags: string[];
  href?: string;
};

export const projects: Project[] = [
  {
    id: "sanjam-world",
    title: "Sanjam World",
    blurb:
      "This site: a personal universe with a photo gallery, a public thoughts wall and a small arcade of browser games.",
    status: "Live",
    year: "2026",
    tags: ["React", "TanStack Start", "Design system"],
  },
  {
    id: "thought-wall",
    title: "Thoughts Wall",
    blurb:
      "A tiny, moderated public guestbook. Anyone can leave a note; everything is stored safely in the cloud database.",
    status: "Live",
    year: "2026",
    tags: ["Cloud database", "Forms", "Moderation"],
    href: "/thoughts",
  },
  {
    id: "arcade",
    title: "Mini Arcade",
    blurb:
      "Guess the Number and Tic-Tac-Toe, built keyboard-first so they play well on a laptop and a phone alike.",
    status: "Live",
    year: "2026",
    tags: ["Games", "Accessibility"],
    href: "/playground",
  },
  {
    id: "multiplayer-rooms",
    title: "Multiplayer Rooms",
    blurb:
      "Room codes so two people can share a board in real time. The interface is sketched out; the live sync is next.",
    status: "In progress",
    year: "2026",
    tags: ["Realtime", "Rooms"],
  },
  {
    id: "photo-journal",
    title: "Photo Journal",
    blurb:
      "A slower, story-led photo feed — each frame with a short caption about where it was taken and why it stuck.",
    status: "Concept",
    year: "2026",
    tags: ["Photography", "Storytelling"],
  },
  {
    id: "sound-lab",
    title: "Sound Lab",
    blurb:
      "An experiment in generative ambient loops that react to the time of day you visit the site.",
    status: "Concept",
    year: "2026",
    tags: ["Web Audio", "Generative"],
  },
];
