DROP TABLE IF EXISTS public.ttt_seats;
DROP TABLE IF EXISTS public.ttt_rooms;

ALTER TABLE public.thoughts ALTER COLUMN is_visible SET DEFAULT false;

DROP POLICY IF EXISTS "Anyone can post a thought" ON public.thoughts;
CREATE POLICY "Anyone can post a thought"
  ON public.thoughts FOR INSERT
  TO anon, authenticated
  WITH CHECK (is_visible = false);

DROP POLICY IF EXISTS "Anyone can read visible thoughts" ON public.thoughts;
CREATE POLICY "Anyone can read visible thoughts"
  ON public.thoughts FOR SELECT
  TO anon, authenticated
  USING (is_visible = true);

GRANT SELECT, INSERT ON public.thoughts TO anon, authenticated;
GRANT ALL ON public.thoughts TO service_role;