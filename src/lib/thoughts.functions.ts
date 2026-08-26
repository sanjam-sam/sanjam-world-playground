import { createServerFn } from "@tanstack/react-start";
import {
  deleteThoughtInputSchema,
  listThoughtsInputSchema,
  updateThoughtInputSchema,
} from "@/lib/thoughts.schemas";
import {
  listThoughtsForModeration,
  permanentlyDeleteThought,
  updateThoughtVisibility,
  type AdminThought,
} from "@/lib/thoughts.server";

export type { AdminThought } from "@/lib/thoughts.server";

export const listAllThoughts = createServerFn({ method: "POST" })
  .inputValidator((data) => listThoughtsInputSchema.parse(data))
  .handler(async ({ data }): Promise<AdminThought[]> => listThoughtsForModeration(data.code));

export const setThoughtVisibility = createServerFn({ method: "POST" })
  .inputValidator((data) => updateThoughtInputSchema.parse(data))
  .handler(async ({ data }) => updateThoughtVisibility(data.code, data.id, data.visible));

export const deleteThought = createServerFn({ method: "POST" })
  .inputValidator((data) => deleteThoughtInputSchema.parse(data))
  .handler(async ({ data }) => permanentlyDeleteThought(data.code, data.id));
