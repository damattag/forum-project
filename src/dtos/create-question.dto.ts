import { ZodValidationPipe } from "@/pipes/zod-validation-pipe";
import { z } from "zod";

export const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

export type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

export const createQuestionBodyValidationSchema = new ZodValidationPipe(
  createQuestionBodySchema
);
