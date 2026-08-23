import { useEffect, useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SYMBOLS = ["★", "☾", "❖", "✦", "⚡", "♪", "☘", "◎"];

type Card = { id: number; symbol: string; flipped: boolean; matched: boolean };

function newDeck(): Card[] {
  const pairs = [...SYMBOLS, ...SYMBOLS];
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j] as string, pairs[i] as string];
  }
  return pairs.map((symbol, id) => ({ id, symbol: symbol as string, flipped: false, matched: false }));
}

export function MemoryMatch() {
  const [cards, setCards] = useState<Card[]>(newDeck);
  const [picked, setPicked] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [best, setBest] = useState<number | null>(null);

  const matchedCount = useMemo(() => cards.filter((c) => c.matched).length, [cards]);
  const won = matchedCount === cards.length;

  useEffect(() => {
    if (picked.length !== 2) return;
    const [a, b] = picked as [number, number];
    const first = cards[a];
    const second = cards[b];
    setMoves((m) => m + 1);
    const isMatch = first && second && first.symbol === second.symbol;
    const timer = window.setTimeout(
      () => {
        setCards((prev) =>
          prev.map((card, i) =>
            i === a || i === b
              ? { ...card, matched: card.matched || Boolean(isMatch), flipped: Boolean(isMatch) }
              : card,
          ),
        );
        setPicked([]);
      },
      isMatch ? 250 : 700,
    );
    return () => window.clearTimeout(timer);
  }, [picked, cards]);

  useEffect(() => {
    if (won) setBest((b) => (b === null || moves < b ? moves : b));
  }, [won, moves]);

  const flip = (index: number) => {
    if (picked.length === 2) return;
    const card = cards[index];
    if (!card || card.flipped || card.matched) return;
    setCards((prev) => prev.map((c, i) => (i === index ? { ...c, flipped: true } : c)));
    setPicked((p) => [...p, index]);
  };

  const restart = () => {
    setCards(newDeck());
    setPicked([]);
    setMoves(0);
  };

  return (
    <section className="surface-card rounded-3xl p-6 md:p-8" aria-labelledby="memory-heading">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id="memory-heading" className="font-display text-2xl font-bold">
            Memory Match
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Flip two cards a turn. Find all eight pairs in as few moves as you can.
          </p>
        </div>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
          Moves {moves}
          {best !== null ? ` · Best ${best}` : ""}
        </span>
      </div>

      <div
        role="grid"
        aria-label="Memory match board"
        className="mt-6 grid grid-cols-4 gap-2 sm:gap-3"
      >
        {cards.map((card, index) => {
          const face = card.flipped || card.matched;
          return (
            <button
              key={card.id}
              role="gridcell"
              type="button"
              onClick={() => flip(index)}
              disabled={face || picked.length === 2}
              aria-label={face ? `Card ${index + 1}, ${card.symbol}` : `Card ${index + 1}, hidden`}
              className={cn(
                "grid aspect-square place-items-center rounded-2xl border border-border/70 text-2xl transition-all duration-300",
                face
                  ? "border-primary/60 bg-primary/10 text-primary"
                  : "bg-background/50 text-transparent hover:border-primary/40 hover:bg-secondary/60",
                card.matched && "border-aqua/60 bg-aqua/10 text-aqua",
              )}
            >
              {face ? card.symbol : "?"}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p role="status" aria-live="polite" className="text-sm font-medium">
          {won ? (
            <span className="text-primary">Cleared in {moves} moves. Nice memory.</span>
          ) : (
            <span className="text-muted-foreground">
              {matchedCount / 2} of {SYMBOLS.length} pairs found
            </span>
          )}
        </p>
        <Button type="button" variant="secondary" onClick={restart}>
          <RotateCcw className="size-4" aria-hidden="true" /> Shuffle & replay
        </Button>
      </div>
    </section>
  );
}
