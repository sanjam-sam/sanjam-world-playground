CREATE OR REPLACE FUNCTION public.list_thoughts_for_moderation(access_code text)
RETURNS TABLE (
  id uuid,
  author_name text,
  message text,
  is_visible boolean,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF btrim(access_code) <> '5790' THEN
    RAISE EXCEPTION 'Wrong code' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  SELECT t.id, t.author_name, t.message, t.is_visible, t.created_at
  FROM public.thoughts AS t
  ORDER BY t.created_at DESC
  LIMIT 300;
END;
$$;

CREATE OR REPLACE FUNCTION public.moderate_thought(
  access_code text,
  thought_id uuid,
  moderation_action text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF btrim(access_code) <> '5790' THEN
    RAISE EXCEPTION 'Wrong code' USING ERRCODE = '42501';
  END IF;

  IF moderation_action = 'show' THEN
    UPDATE public.thoughts SET is_visible = true WHERE id = thought_id;
  ELSIF moderation_action = 'hide' THEN
    UPDATE public.thoughts SET is_visible = false WHERE id = thought_id;
  ELSIF moderation_action = 'delete' THEN
    DELETE FROM public.thoughts WHERE id = thought_id;
  ELSE
    RAISE EXCEPTION 'Invalid moderation action' USING ERRCODE = '22023';
  END IF;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Thought not found' USING ERRCODE = 'P0002';
  END IF;

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.list_thoughts_for_moderation(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.moderate_thought(text, uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.list_thoughts_for_moderation(text) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.moderate_thought(text, uuid, text) TO anon, authenticated, service_role;