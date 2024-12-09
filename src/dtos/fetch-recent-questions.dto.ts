import { ZodValidationPipe } from "@/pipes/zod-validation-pipe";
import { z } from "zod";

export const fetchRecentQuestionsQueryParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().nonnegative().default(10),
});

export type FetchRecentQuestionsQueryParamsSchema = z.infer<
  typeof fetchRecentQuestionsQueryParamsSchema
>;

export const fetchRecentQuestionsQueryParamsValidationSchema =
  new ZodValidationPipe(fetchRecentQuestionsQueryParamsSchema);
