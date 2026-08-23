import { createServerFn } from "@tanstack/react-start";
import { winnerOf, type Cell, type RoomState } from "./ttt-core";

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomCode() {
  let out = "";
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  for (const b of bytes) out += CODE_ALPHABET[b % CODE_ALPHABET.length];
  return out;
}

function randomToken() {
  return Array.from(crypto.getRandomValues(new Uint8Array(24)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function normalizeCode(raw: unknown): string {
  const code = String(raw ?? "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 6);
  if (code.length !== 6) throw new Error("Room codes are 6 characters.");
  return code;
}

function publicRoom(row: Record<string, unknown>): RoomState {
  return {
    id: row['id'] as string,
    code: row['code'] as string,
    board: row['board'] as Cell[],
    turn: row['turn'] as "X" | "O",
    status: row['status'] as RoomState["status"],
    winner: (row['winner'] as string | null) ?? null,
    x_joined: Boolean(row['x_joined']),
    o_joined: Boolean(row['o_joined']),
    score_x: Number(row['score_x'] ?? 0),
    score_o: Number(row['score_o'] ?? 0),
    draws: Number(row['draws'] ?? 0),
  };
}

const EMPTY: Cell[] = [null, null, null, null, null, null, null, null, null];

export const createRoom = createServerFn({ method: "POST" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  for (let attempt = 0; attempt < 6; attempt++) {
    const code = randomCode();
    const { data, error } = await supabaseAdmin
      .from("ttt_rooms")
      .insert({ code })
      .select("*")
      .single();
    if (error) {
      if (error.code === "23505") continue;
      throw new Error("Could not create the room. Try again.");
    }
    const token = randomToken();
    const seat = await supabaseAdmin
      .from("ttt_seats")
      .insert({ room_id: data.id, seat: "X", token });
    if (seat.error) throw new Error("Could not create the room. Try again.");
    return { room: publicRoom(data), seat: "X" as const, token };
  }
  throw new Error("Could not create the room. Try again.");
});

export const joinRoom = createServerFn({ method: "POST" })
  .inputValidator((input: { code: string }) => ({ code: normalizeCode(input?.code) }))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: room } = await supabaseAdmin
      .from("ttt_rooms")
      .select("*")
      .eq("code", data.code)
      .maybeSingle();
    if (!room) throw new Error("No room with that code.");
    if (room.o_joined) throw new Error("That room is already full.");

    const token = randomToken();
    const seat = await supabaseAdmin
      .from("ttt_seats")
      .insert({ room_id: room.id, seat: "O", token });
    if (seat.error) throw new Error("That room is already full.");

    const { data: updated, error } = await supabaseAdmin
      .from("ttt_rooms")
      .update({ o_joined: true, status: "playing", updated_at: new Date().toISOString() })
      .eq("id", room.id)
      .select("*")
      .single();
    if (error || !updated) throw new Error("Could not join that room.");
    return { room: publicRoom(updated), seat: "O" as const, token };
  });

export const getRoom = createServerFn({ method: "POST" })
  .inputValidator((input: { code: string }) => ({ code: normalizeCode(input?.code) }))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: room } = await supabaseAdmin
      .from("ttt_rooms")
      .select("*")
      .eq("code", data.code)
      .maybeSingle();
    if (!room) throw new Error("No room with that code.");
    return { room: publicRoom(room) };
  });

async function authorize(code: string, token: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: room } = await supabaseAdmin
    .from("ttt_rooms")
    .select("*")
    .eq("code", code)
    .maybeSingle();
  if (!room) throw new Error("No room with that code.");
  const { data: seatRow } = await supabaseAdmin
    .from("ttt_seats")
    .select("seat")
    .eq("room_id", room.id)
    .eq("token", token)
    .maybeSingle();
  if (!seatRow) throw new Error("You are not a player in this room.");
  return { supabaseAdmin, room, seat: seatRow.seat as "X" | "O" };
}

export const makeMove = createServerFn({ method: "POST" })
  .inputValidator((input: { code: string; token: string; index: number }) => {
    const index = Number(input?.index);
    if (!Number.isInteger(index) || index < 0 || index > 8) throw new Error("Invalid square.");
    const token = String(input?.token ?? "");
    if (token.length < 16) throw new Error("Invalid session.");
    return { code: normalizeCode(input?.code), token, index };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin, room, seat } = await authorize(data.code, data.token);
    if (room.status !== "playing") throw new Error("The game is not in progress.");
    if (room.turn !== seat) throw new Error("It is not your turn.");

    const board = [...((room.board as Cell[]) ?? EMPTY)];
    if (board[data.index]) throw new Error("That square is taken.");
    board[data.index] = seat;

    const win = winnerOf(board);
    const full = board.every(Boolean);
    const patch: Record<string, unknown> = {
      board,
      turn: seat === "X" ? "O" : "X",
      updated_at: new Date().toISOString(),
    };
    if (win) {
      patch['status'] = "finished";
      patch['winner'] = win.mark;
      patch[win.mark === "X" ? "score_x" : "score_o"] =
        (win.mark === "X" ? room.score_x : room.score_o) + 1;
    } else if (full) {
      patch['status'] = "finished";
      patch['winner'] = "draw";
      patch['draws'] = room.draws + 1;
    }

    const { data: updated, error } = await supabaseAdmin
      .from("ttt_rooms")
      .update(patch)
      .eq("id", room.id)
      .select("*")
      .single();
    if (error || !updated) throw new Error("Move failed. Try again.");
    return { room: publicRoom(updated) };
  });

export const resetRound = createServerFn({ method: "POST" })
  .inputValidator((input: { code: string; token: string }) => ({
    code: normalizeCode(input?.code),
    token: String(input?.token ?? ""),
  }))
  .handler(async ({ data }) => {
    const { supabaseAdmin, room } = await authorize(data.code, data.token);
    const { data: updated, error } = await supabaseAdmin
      .from("ttt_rooms")
      .update({
        board: EMPTY,
        turn: "X",
        winner: null,
        status: room.o_joined ? "playing" : "waiting",
        updated_at: new Date().toISOString(),
      })
      .eq("id", room.id)
      .select("*")
      .single();
    if (error || !updated) throw new Error("Could not reset the board.");
    return { room: publicRoom(updated) };
  });
