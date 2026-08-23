import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MOVES = [
  { key: "rock", label: "Rock", icon: "✊" },
  { key: "paper", label: "Paper", icon: "✋" },
  { key: "scissors", label: "Scissors", icon: "✌️" },
] as const;

type MoveKey = (typeof MOVES)[number]["key"];

const BEATS: Record<MoveKey, MoveKey> = {
  rock: "scissors",
  paper: "rock",
  scissors: "paper",
};

export function RockPaperScissors() {
  const [you, setYou] = useState<MoveKey | null>(null);
  const [cpu, setCpu] = useState<MoveKey | null>(null);
  const [result, setResult] = useState<"win" | "lose" | "draw" | null>(null);
  const [score, setScore] = useState({ you: 0, cpu: 0, draws: 0 });

  const play = (choice: MoveKey) => {
    const bot = MOVES[Math.floor(Math.random() * MOVES.length)]!.key;
    setYou(choice);
    setCpu(bot);
    if (choice === bot) {
      setResult("draw");
      setScore((s) => ({ ...s, draws: s.draws + 1 }));
    } else if (BEATS[choice] === bot) {
      setResult("win");
      setScore((s) => ({ ...s, you: s.you + 1 }));
    } else {
      setResult("lose");
      setScore((s) => ({ ...s, cpu: s.cpu + 1 }));
    }
  };

  const resetAll = () => {
    setYou(null);
    setCpu(null);
    setResult(null);
    setScore({ you: 0, cpu: 0, draws: 0 });
  };

  const icon = (key: MoveKey | null) => MOVES.find((m) => m.key === key)?.icon ?? "•";

  return (
    <section className="surface-card rounded-3xl p-6 md:p-8" aria-labelledby="rps-heading">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id="rps-heading" className="font-display text-2xl font-bold">
            Rock Paper Scissors
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick a hand. Rock beats scissors, scissors beats paper, paper beats rock.
          </p>
        </div>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
          You {score.you} · CPU {score.cpu} · Draws {score.draws}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
        {MOVES.map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={() => play(m.key)}
            aria-label={`Play ${m.label}`}
            className={cn(
              "flex flex-col items-center gap-2 rounded-2xl border border-border/70 bg-background/50 p-4 transition-all",
              "hover:-translate-y-0.5 hover:border-primary/60 hover:bg-secondary/60",
              you === m.key && "border-primary bg-primary/10",
            )}
          >
            <span className="text-3xl" aria-hidden="true">
              {m.icon}
            </span>
            <span className="font-display text-xs font-semibold">{m.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-6 rounded-2xl border border-border/70 bg-background/40 p-5">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">You</p>
          <p className="text-4xl" aria-hidden="true">
            {icon(you)}
          </p>
        </div>
        <span className="font-display text-sm text-muted-foreground">vs</span>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">CPU</p>
          <p className="text-4xl" aria-hidden="true">
            {icon(cpu)}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p role="status" aria-live="polite" className="text-sm font-medium">
          {result === "win" ? (
            <span className="text-primary">You take the round.</span>
          ) : result === "lose" ? (
            <span className="text-accent">CPU takes that one.</span>
          ) : result === "draw" ? (
            <span className="text-muted-foreground">Dead heat. Go again.</span>
          ) : (
            <span className="text-muted-foreground">Choose a hand to start.</span>
          )}
        </p>
        <Button type="button" variant="secondary" onClick={resetAll}>
          <RotateCcw className="size-4" aria-hidden="true" /> Reset score
        </Button>
      </div>
    </section>
  );
}
