import { createServerFn } from "@tanstack/react-start";

export type AdminThought = {
  id: string;
  author_name: string | null;
  message: string;
  is_visible: boolean;
  created_at: string;
};

function assertCode(code: string) {
  const expected = process.env["THOUGHTS_ADMIN_CODE"];
  if (!expected) throw new Error("Moderation is not configured.");
  const a = code.trim();
  if (a.length !== expected.length) throw new Error("Wrong code.");
  let diff = 0;
  for (let i = 0; i < expected.length; i += 1) diff |= a.charCodeAt(i) ^ expected.charCodeAt(i);
  if (diff !== 0) throw new Error("Wrong code.");
}

export const listAllThoughts = createServerFn({ method: "POST" })
  .inputValidator((data: { code: string }) => data)
  .handler(async ({ data }): Promise<AdminThought[]> => {
    assertCode(data.code);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("thoughts")
      .select("id, author_name, message, is_visible, created_at")
      .order("created_at", { ascending: false })
      .limit(300);
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const setThoughtVisibility = createServerFn({ method: "POST" })
  .inputValidator((data: { code: string; id: string; visible: boolean }) => data)
  .handler(async ({ data }) => {
    assertCode(data.code);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("thoughts")
      .update({ is_visible: data.visible })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const deleteThought = createServerFn({ method: "POST" })
  .inputValidator((data: { code: string; id: string }) => data)
  .handler(async ({ data }) => {
    assertCode(data.code);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("thoughts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
