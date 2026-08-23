CREATE TABLE public.ttt_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  board jsonb NOT NULL DEFAULT '[null,null,null,null,null,null,null,null,null]'::jsonb,
  turn text NOT NULL DEFAULT 'X',
  status text NOT NULL DEFAULT 'waiting',
  winner text,
  x_joined boolean NOT NULL DEFAULT true,
  o_joined boolean NOT NULL DEFAULT false,
  score_x integer NOT NULL DEFAULT 0,
  score_o integer NOT NULL DEFAULT 0,
  draws integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.ttt_rooms TO anon, authenticated;
GRANT ALL ON public.ttt_rooms TO service_role;
ALTER TABLE public.ttt_rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can watch a room" ON public.ttt_rooms FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.ttt_seats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES public.ttt_rooms(id) ON DELETE CASCADE,
  seat text NOT NULL,
  token text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (room_id, seat)
);

GRANT ALL ON public.ttt_seats TO service_role;
ALTER TABLE public.ttt_seats ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.ttt_rooms REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ttt_rooms;