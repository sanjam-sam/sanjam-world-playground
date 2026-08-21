import { useState } from "react";
import { Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Honest placeholder: the room-code interface is designed, but live
 * multiplayer sync is not built yet. Nothing here pretends to connect.
 */
export function JoinRoom() {
  const [code, setCode] = useState("");
  const clean = code.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 6);

  return (
    <section
      className="surface-card rounded-3xl border-dashed p-6 md:p-8"
      aria-labelledby="room-heading"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id="room-heading" className="font-display text-2xl font-bold">
            Join a Game
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Play with a friend using a six-character room code.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
          <Clock className="size-3.5" aria-hidden="true" /> Coming soon
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <Label htmlFor="room-code" className="text-xs text-muted-foreground">
            Room code
          </Label>
          <Input
            id="room-code"
            value={clean}
            onChange={(e) => setCode(e.target.value)}
            placeholder="ABC123"
            maxLength={6}
            autoComplete="off"
            spellCheck={false}
            aria-describedby="room-note"
            className="mt-1.5 bg-background/60 font-display text-lg tracking-[0.35em] uppercase"
          />
        </div>
        <Button type="button" disabled className="h-10 sm:mb-0.5">
          <Users className="size-4" aria-hidden="true" /> Join room
        </Button>
      </div>

      <p id="room-note" className="mt-4 text-sm text-muted-foreground">
        Real-time rooms are not live yet — this is the interface only, so joining is disabled on
        purpose rather than quietly failing. Until then, Guess the Number and Tic-Tac-Toe above are
        fully playable, and Tic-Tac-Toe works great pass-and-play on one screen.
      </p>
    </section>
  );
}
