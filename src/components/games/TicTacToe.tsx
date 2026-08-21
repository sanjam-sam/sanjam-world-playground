import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Cell = "X" | "O" | null;

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function winnerOf(board: Cell[]): { mark: "X" | "O"; line: number[] } | null {
  for (const line of LINES) {
    const [a = 0, b = 0, c = 0] = line;
    const mark = board[a];
    if (mark && mark === board[b] && mark === board[c]) {
      return { mark, line };
    }
  }
  return null;
}

export function TicTacToe() {
  const [board, setBoard] = useState<Cell[]>(Array<Cell>(9).fill(null));
  const [xNext, setXNext] = useState(true);
  const [score, setScore] = useState({ X: 0, O: 0, draws: 0 });

  const win = winnerOf(board);
  const full = board.every(Boolean);
  const over = Boolean(win) || full;

  const play = (index: number) => {
    if (over || board[index]) return;
    const next = [...board];
    next[index] = xNext ? "X" : "O";
    const result = winnerOf(next);
    setBoard(next);
    setXNext(!xNext);
    if (result?.mark) {
      setScore((s) => ({ ...s, [result.mark as "X" | "O"]: s[result.mark as "X" | "O"] + 1 }));
    } else if (next.every(Boolean)) {
      setScore((s) => ({ ...s, draws: s.draws + 1 }));
    }
  };

  const reset = () => {
    setBoard(Array<Cell>(9).fill(null));
    setXNext(true);
  };

  return (
    <section className="surface-card rounded-3xl p-6 md:p-8" aria-labelledby="ttt-heading">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id="ttt-heading" className="font-display text-2xl font-bold">
            Tic-Tac-Toe
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Two players, one device. Arrow-key or tab to a square, then press Enter.
          </p>
        </div>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
          X {score.X} · O {score.O} · Draws {score.draws}
        </span>
      </div>

      <div
        role="grid"
        aria-label="Tic tac toe board"
        className="mx-auto mt-6 grid w-full max-w-xs grid-cols-3 gap-2"
      >
        {board.map((cell, index) => {
          const highlighted = win?.line.includes(index);
          return (
            <button
              key={index}
              role="gridcell"
              type="button"
              onClick={() => play(index)}
              disabled={Boolean(cell) || over}
              aria-label={`Square ${index + 1}${cell ? `, ${cell}` : ", empty"}`}
              className={cn(
                "grid aspect-square place-items-center rounded-2xl border border-border/70 bg-background/50 font-display text-3xl font-bold transition-all",
                "hover:border-primary/60 hover:bg-secondary/60 disabled:cursor-not-allowed",
                highlighted && "border-primary bg-primary/15 text-primary",
                cell === "X" && !highlighted && "text-aqua",
                cell === "O" && !highlighted && "text-accent",
              )}
            >
              {cell}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p role="status" aria-live="polite" className="text-sm font-medium">
          {win ? (
            <span className="text-primary">{win.mark} wins this round!</span>
          ) : full ? (
            <span className="text-muted-foreground">A draw. Run it back.</span>
          ) : (
            <span className="text-muted-foreground">
              Turn: <span className="text-foreground">{xNext ? "X" : "O"}</span>
            </span>
          )}
        </p>
        <Button type="button" variant="secondary" onClick={reset}>
          <RotateCcw className="size-4" aria-hidden="true" /> Reset board
        </Button>
      </div>
    </section>
  );
}
