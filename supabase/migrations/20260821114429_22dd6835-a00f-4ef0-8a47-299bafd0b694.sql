CREATE TABLE public.thoughts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_name TEXT,
  message TEXT NOT NULL,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT thoughts_message_length CHECK (char_length(message) BETWEEN 1 AND 500),
  CONSTRAINT thoughts_author_length CHECK (author_name IS NULL OR char_length(author_name) <= 40)
);

GRANT SELECT, INSERT ON public.thoughts TO anon;
GRANT SELECT, INSERT ON public.thoughts TO authenticated;
GRANT ALL ON public.thoughts TO service_role;

ALTER TABLE public.thoughts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read visible thoughts"
  ON public.thoughts FOR SELECT
  TO anon, authenticated
  USING (is_visible = true);

CREATE POLICY "Anyone can post a thought"
  ON public.thoughts FOR INSERT
  TO anon, authenticated
  WITH CHECK (is_visible = true);

CREATE INDEX thoughts_created_at_idx ON public.thoughts (created_at DESC);