import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { GuessTheNumber } from "@/components/games/GuessTheNumber";
import { TicTacToe } from "@/components/games/TicTacToe";
import { JoinRoom } from "@/components/games/JoinRoom";

export const Route = createFileRoute("/playground")({
  head: () => ({
    meta: [
      { title: "Playground — Games in Sanjam World" },
      {
        name: "description",
        content:
          "Play Guess the Number and Tic-Tac-Toe right in the browser, keyboard-friendly and no sign-up needed.",
      },
      { property: "og:title", content: "Playground — Games in Sanjam World" },
      {
        property: "og:description",
        content: "Two playable browser games, plus a preview of multiplayer rooms.",
      },
    ],
  }),
  component: PlaygroundPage,
});

function PlaygroundPage() {
  return (
    <>
      <PageHeader eyebrow="Playground" title="Small games, instant play">
        <p>
          No accounts, no downloads. Pick a game and go — both work with a keyboard and on a phone.
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
        </div>

        <Reveal delay={120} className="mt-5 block">
          <JoinRoom />
        </Reveal>
      </section>
    </>
  );
}
