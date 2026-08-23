export type Cell = "X" | "O" | null;

export const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

export function winnerOf(board: Cell[]): { mark: "X" | "O"; line: readonly number[] } | null {
  for (const line of LINES) {
    const [a, b, c] = line;
    const mark = board[a];
    if (mark && mark === board[b] && mark === board[c]) return { mark, line };
  }
  return null;
}

export type RoomState = {
  id: string;
  code: string;
  board: Cell[];
  turn: "X" | "O";
  status: "waiting" | "playing" | "finished";
  winner: string | null;
  x_joined: boolean;
  o_joined: boolean;
  score_x: number;
  score_o: number;
  draws: number;
};
