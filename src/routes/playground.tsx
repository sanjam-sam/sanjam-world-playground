import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { GuessTheNumber } from "@/components/games/GuessTheNumber";
import { TicTacToe } from "@/components/games/TicTacToe";
import { MemoryMatch } from "@/components/games/MemoryMatch";
import { RockPaperScissors } from "@/components/games/RockPaperScissors";
import { OnlineTicTacToe } from "@/components/games/OnlineTicTacToe";

export const Route = createFileRoute("/playground")({
  head: () => ({
    meta: [
      { title: "Playground — Games in Sanjam World" },
      {
        name: "description",
        content:
          "Play Guess the Number, Tic-Tac-Toe, Memory Match and Rock Paper Scissors in the browser, plus online two-player Tic-Tac-Toe with room codes.",
      },
      { property: "og:title", content: "Playground — Games in Sanjam World" },
      {
        property: "og:description",
        content: "Four instant browser games plus live two-player Tic-Tac-Toe rooms.",
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
          No accounts, no downloads. Play solo, pass a phone around, or open a room and take on a
          friend from anywhere.
        </p>
      </PageHeader>

      <section className="mx-auto max-w-6xl px-5 pb-8">
        <Reveal className="block">
          <OnlineTicTacToe />
        </Reveal>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
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
