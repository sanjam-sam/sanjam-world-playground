import { useCallback, useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Copy, LogIn, Loader2, PlusCircle, RotateCcw, Wifi } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { createRoom, joinRoom, makeMove, resetRound } from "@/lib/ttt.functions";
import { winnerOf, type Cell, type RoomState } from "@/lib/ttt-core";
import { cn } from "@/lib/utils";

type Session = { code: string; seat: "X" | "O"; token: string };

const STORAGE_KEY = "sw.ttt.session";

function errorText(error: unknown) {
  return error instanceof Error && error.message ? error.message : "Something went wrong.";
}

export function OnlineTicTacToe() {
  const create = useServerFn(createRoom);
  const join = useServerFn(joinRoom);
  const move = useServerFn(makeMove);
  const reset = useServerFn(resetRound);

  const [session, setSession] = useState<Session | null>(null);
  const [room, setRoom] = useState<RoomState | null>(null);
  const [codeInput, setCodeInput] = useState("");
  const [busy, setBusy] = useState<"create" | "join" | "move" | "reset" | null>(null);
  const [live, setLive] = useState(false);
  const roomIdRef = useRef<string | null>(null);

  // Restore a session so a refresh does not drop you out of the room.
  useEffect(() => {
    const raw = typeof window === "undefined" ? null : sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      setSession(JSON.parse(raw) as Session);
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const remember = useCallback((next: Session | null) => {
    setSession(next);
    if (typeof window === "undefined") return;
    if (next) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  // Live room updates.
  useEffect(() => {
    if (!room?.id) return;
    roomIdRef.current = room.id;
    const channel = supabase
      .channel(`ttt-room-${room.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "ttt_rooms", filter: `id=eq.${room.id}` },
        (payload) => {
          const next = payload.new as unknown as RoomState;
          setRoom((prev) => (prev && prev.id === next.id ? { ...prev, ...next } : prev));
        },
      )
      .subscribe((status) => setLive(status === "SUBSCRIBED"));

    return () => {
      setLive(false);
      supabase.removeChannel(channel);
    };
  }, [room?.id]);

  const handleCreate = async () => {
    setBusy("create");
    try {
      const res = await create({ data: undefined });
      setRoom(res.room);
      remember({ code: res.room.code, seat: res.seat, token: res.token });
      toast.success(`Room ${res.room.code} created — share the code.`);
    } catch (error) {
      toast.error(errorText(error));
    } finally {
      setBusy(null);
    }
  };

  const handleJoin = async () => {
    const code = codeInput.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    if (code.length !== 6) {
      toast.error("Room codes are 6 characters.");
      return;
    }
    setBusy("join");
    try {
      const res = await join({ data: { code } });
      setRoom(res.room);
      remember({ code: res.room.code, seat: res.seat, token: res.token });
      toast.success(`Joined room ${res.room.code}.`);
    } catch (error) {
      toast.error(errorText(error));
    } finally {
      setBusy(null);
    }
  };

  const handleMove = async (index: number) => {
    if (!session || !room) return;
    setBusy("move");
    try {
      const res = await move({ data: { code: session.code, token: session.token, index } });
      setRoom(res.room);
    } catch (error) {
      toast.error(errorText(error));
    } finally {
      setBusy(null);
    }
  };

  const handleReset = async () => {
    if (!session) return;
    setBusy("reset");
    try {
      const res = await reset({ data: { code: session.code, token: session.token } });
      setRoom(res.room);
    } catch (error) {
      toast.error(errorText(error));
    } finally {
      setBusy(null);
    }
  };

  const leave = () => {
    remember(null);
    setRoom(null);
    setCodeInput("");
  };

  const copyCode = async () => {
    if (!room) return;
    try {
      await navigator.clipboard.writeText(room.code);
      toast.success("Room code copied.");
    } catch {
      toast.error("Copy failed — read the code out loud instead.");
    }
  };

  const board: Cell[] = room?.board ?? [];
  const win = room ? winnerOf(board) : null;
  const myTurn = Boolean(room && session && room.status === "playing" && room.turn === session.seat);

  return (
    <section className="surface-card rounded-3xl p-6 md:p-8" aria-labelledby="online-heading">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id="online-heading" className="font-display text-2xl font-bold">
            Online Tic-Tac-Toe
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Create a room, send the six-character code to a friend, and play from two devices.
          </p>
        </div>
        {room ? (
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
              live ? "bg-aqua/15 text-aqua" : "bg-secondary text-secondary-foreground",
            )}
          >
            <Wifi className="size-3.5" aria-hidden="true" /> {live ? "Live" : "Connecting…"}
          </span>
        ) : null}
      </div>

      {!room || !session ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-border/70 bg-background/40 p-5">
            <h4 className="font-display text-sm font-semibold">Start a room</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              You play as X and move first. Share the code that appears.
            </p>
            <Button
              type="button"
              onClick={handleCreate}
              disabled={busy !== null}
              className="mt-4 w-full"
            >
              {busy === "create" ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <PlusCircle className="size-4" aria-hidden="true" />
              )}
              Create room
            </Button>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/40 p-5">
            <h4 className="font-display text-sm font-semibold">Join with a code</h4>
            <Label htmlFor="room-code" className="mt-3 block text-xs text-muted-foreground">
              Room code
            </Label>
            <Input
              id="room-code"
              value={codeInput.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 6)}
              onChange={(e) => setCodeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void handleJoin();
              }}
              placeholder="ABC123"
              maxLength={6}
              autoComplete="off"
              spellCheck={false}
              className="mt-1.5 bg-background/60 font-display text-lg tracking-[0.35em] uppercase"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={handleJoin}
              disabled={busy !== null}
              className="mt-4 w-full"
            >
              {busy === "join" ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <LogIn className="size-4" aria-hidden="true" />
              )}
              Join room
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-border/70 bg-background/40 p-4">
            <div>
              <p className="text-xs text-muted-foreground">Room code</p>
              <p className="font-display text-2xl font-bold tracking-[0.3em]">{room.code}</p>
            </div>
            <Button type="button" size="sm" variant="secondary" onClick={copyCode}>
              <Copy className="size-4" aria-hidden="true" /> Copy
            </Button>
            <span className="ml-auto rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
              You are {session.seat} · X {room.score_x} · O {room.score_o} · Draws {room.draws}
            </span>
          </div>

          {room.status === "waiting" ? (
            <p
              role="status"
              aria-live="polite"
              className="mt-4 flex items-center gap-2 rounded-2xl border border-dashed border-border/70 bg-card/40 p-4 text-sm text-muted-foreground"
            >
              <Loader2 className="size-4 animate-spin text-primary" aria-hidden="true" />
              Waiting for a second player to join with code{" "}
              <span className="font-semibold text-foreground">{room.code}</span>…
            </p>
          ) : null}

          <div
            role="grid"
            aria-label="Online tic tac toe board"
            className="mx-auto mt-6 grid w-full max-w-xs grid-cols-3 gap-2"
          >
            {board.map((cell, index) => {
              const highlighted = win?.line.includes(index);
              return (
                <button
                  key={index}
                  role="gridcell"
                  type="button"
                  onClick={() => handleMove(index)}
                  disabled={!myTurn || Boolean(cell) || busy === "move"}
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
              {room.status === "finished" ? (
                room.winner === "draw" ? (
                  <span className="text-muted-foreground">A draw. Run it back.</span>
                ) : (
                  <span className="text-primary">
                    {room.winner} wins{room.winner === session.seat ? " — that's you!" : "."}
                  </span>
                )
              ) : room.status === "waiting" ? (
                <span className="text-muted-foreground">Waiting for player O…</span>
              ) : myTurn ? (
                <span className="text-foreground">Your turn ({session.seat}).</span>
              ) : (
                <span className="text-muted-foreground">Waiting for {room.turn} to move…</span>
              )}
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={handleReset}
                disabled={busy !== null}
              >
                <RotateCcw className="size-4" aria-hidden="true" /> New round
              </Button>
              <Button type="button" variant="ghost" onClick={leave}>
                Leave
              </Button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
