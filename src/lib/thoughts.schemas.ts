import { z } from "zod";

const accessCodeSchema = z.preprocess(
  (value) => (typeof value === "number" ? String(value) : value),
  z.string().trim().min(1).max(32),
);

export const listThoughtsInputSchema = z.object({
  code: accessCodeSchema,
});

export const updateThoughtInputSchema = z.object({
  code: accessCodeSchema,
  id: z.string().uuid(),
  visible: z.boolean(),
});

export const deleteThoughtInputSchema = z.object({
  code: accessCodeSchema,
  id: z.string().uuid(),
});