import { supabaseAdmin } from "@/integrations/supabase/client.server";

// Change this single value when the private moderation access code needs updating.
export const ADMIN_ACCESS_CODE = "5790";

export type AdminThought = {
  id: string;
  author_name: string | null;
  message: string;
  is_visible: boolean;
  created_at: string;
};

function normalizeAccessCode(code: string) {
  return code.trim();
}

function assertAdminAccess(code: string) {
  const received = normalizeAccessCode(code);
  if (received.length !== ADMIN_ACCESS_CODE.length) throw new Error("Wrong code.");

  let difference = 0;
  for (let index = 0; index < ADMIN_ACCESS_CODE.length; index += 1) {
    difference |= received.charCodeAt(index) ^ ADMIN_ACCESS_CODE.charCodeAt(index);
  }
  if (difference !== 0) throw new Error("Wrong code.");
}

export async function listThoughtsForModeration(code: string): Promise<AdminThought[]> {
  assertAdminAccess(code);
  const { data, error } = await supabaseAdmin
    .from("thoughts")
    .select("id, author_name, message, is_visible, created_at")
    .order("created_at", { ascending: false })
    .limit(300);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function updateThoughtVisibility(code: string, id: string, visible: boolean) {
  assertAdminAccess(code);
  const { error } = await supabaseAdmin.from("thoughts").update({ is_visible: visible }).eq("id", id);
  if (error) throw new Error(error.message);
  return { ok: true as const };
}

export async function permanentlyDeleteThought(code: string, id: string) {
  assertAdminAccess(code);
  const { error } = await supabaseAdmin.from("thoughts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { ok: true as const };
}