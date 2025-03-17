import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod';

export const deleteQuestionParamsSchema = z.object({
	id: z.string(),
});

export type DeleteQuestionParamsSchema = z.infer<typeof deleteQuestionParamsSchema>;

export const deleteQuestionParamsValidationSchema = new ZodValidationPipe(
	deleteQuestionParamsSchema,
);
