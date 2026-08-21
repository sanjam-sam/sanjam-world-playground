import { useEffect, useRef, useState } from "react";
import { ArrowUp, ArrowDown, PartyPopper, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MAX = 100;
const MAX_TRIES = 8;

type Entry = { guess: number; hint: "high" | "low" | "hit" };

function randomTarget() {
  return Math.floor(Math.random() * MAX) + 1;
}

export function GuessTheNumber() {
  const [target, setTarget] = useState(1);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<Entry[]>([]);
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Randomise on the client only, so server and client markup match.
  useEffect(() => setTarget(randomTarget()), []);

  const reset = () => {
    setTarget(randomTarget());
    setHistory([]);
    setValue("");
    setStatus("playing");
    setError(null);
    inputRef.current?.focus();
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (status !== "playing") return;
    const guess = Number(value);
    if (!Number.isInteger(guess) || guess < 1 || guess > MAX) {
      setError(`Enter a whole number between 1 and ${MAX}.`);
      return;
    }
    setError(null);
    const hint: Entry["hint"] = guess === target ? "hit" : guess < target ? "low" : "high";
    const next = [...history, { guess, hint }];
    setHistory(next);
    setValue("");
    if (hint === "hit") setStatus("won");
    else if (next.length >= MAX_TRIES) setStatus("lost");
  };

  const last = history[history.length - 1];
  const remaining = MAX_TRIES - history.length;

  return (
    <section className="surface-card rounded-3xl p-6 md:p-8" aria-labelledby="guess-heading">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id="guess-heading" className="font-display text-2xl font-bold">
            Guess the Number
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            I picked a number from 1 to {MAX}. You get {MAX_TRIES} tries.
          </p>
        </div>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
          {status === "playing" ? `${remaining} tries left` : "Round over"}
        </span>
      </div>

      <form onSubmit={submit} className="mt-6 flex flex-wrap items-end gap-3">
        <div className="min-w-[9rem] flex-1">
          <Label htmlFor="guess-input" className="text-xs text-muted-foreground">
            Your guess
          </Label>
          <Input
            id="guess-input"
            ref={inputRef}
            type="number"
            inputMode="numeric"
            min={1}
            max={MAX}
            value={value}
            disabled={status !== "playing"}
            onChange={(e) => setValue(e.target.value)}
            aria-describedby="guess-feedback"
            aria-invalid={error ? true : undefined}
            className="mt-1.5 bg-background/60"
            placeholder="e.g. 42"
          />
        </div>
        <Button type="submit" disabled={status !== "playing"} className="h-10">
          Guess
        </Button>
        <Button type="button" variant="secondary" onClick={reset} className="h-10">
          <RotateCcw className="size-4" aria-hidden="true" /> New round
        </Button>
      </form>

      <p id="guess-feedback" role="status" aria-live="polite" className="mt-4 text-sm font-medium">
        {error ? (
          <span className="text-destructive">{error}</span>
        ) : status === "won" ? (
          <span className="inline-flex items-center gap-2 text-primary">
            <PartyPopper className="size-4" aria-hidden="true" /> Got it in {history.length}{" "}
            {history.length === 1 ? "try" : "tries"} — it was {target}.
          </span>
        ) : status === "lost" ? (
          <span className="text-accent">Out of tries! The number was {target}.</span>
        ) : last ? (
          <span className="inline-flex items-center gap-2 text-muted-foreground">
            {last.hint === "low" ? (
              <ArrowUp className="size-4 text-aqua" aria-hidden="true" />
            ) : (
              <ArrowDown className="size-4 text-accent" aria-hidden="true" />
            )}
            {last.guess} is too {last.hint === "low" ? "low" : "high"} — go{" "}
            {last.hint === "low" ? "higher" : "lower"}.
          </span>
        ) : (
          <span className="text-muted-foreground">Type a number and press Guess to start.</span>
        )}
      </p>

      {history.length > 0 ? (
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Previous guesses">
          {history.map((entry, index) => (
            <li
              key={`${entry.guess}-${index}`}
              className="rounded-full border border-border/70 bg-background/50 px-3 py-1 text-xs text-muted-foreground"
            >
              {entry.guess}
              <span className="ml-1.5 text-foreground/70">
                {entry.hint === "hit" ? "✓" : entry.hint === "low" ? "↑" : "↓"}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
