import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { GuessTheNumber } from "@/components/games/GuessTheNumber";
import { TicTacToe } from "@/components/games/TicTacToe";
import { MemoryMatch } from "@/components/games/MemoryMatch";
import { RockPaperScissors } from "@/components/games/RockPaperScissors";

export const Route = createFileRoute("/playground")({
  head: () => ({
    meta: [
      { title: "Playground — Games in Sanjam World" },
      {
        name: "description",
        content:
          "Play Guess the Number, Tic-Tac-Toe, Memory Match and Rock Paper Scissors instantly in your browser.",
      },
      { property: "og:title", content: "Playground — Games in Sanjam World" },
      {
        property: "og:description",
        content: "Four instant browser games — no accounts, no downloads.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlaygroundPage,
});

function PlaygroundPage() {
  return (
    <>
      <PageHeader eyebrow="Playground" title="Small games, instant play">
        <p>
          No accounts, no downloads. Play solo, or pass a phone around and take turns.
        </p>
      </PageHeader>

      <section className="mx-auto max-w-6xl px-5 pb-8">
        <div className="grid gap-5 lg:grid-cols-2">
          <Reveal>
            <GuessTheNumber />
          </Reveal>
          <Reveal delay={90}>
            <TicTacToe />
          </Reveal>
          <Reveal delay={120}>
            <MemoryMatch />
          </Reveal>
          <Reveal delay={150}>
            <RockPaperScissors />
          </Reveal>
        </div>
      </section>
    </>
  );
}
