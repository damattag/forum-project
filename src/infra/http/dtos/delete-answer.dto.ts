import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

export const deleteAnswerParamsSchema = z.object({
	id: z.string(),
});

export type DeleteAnswerParamsSchema = z.infer<typeof deleteAnswerParamsSchema>;

export const deleteAnswerParamsValidationSchema = new ZodValidationPipe(
	deleteAnswerParamsSchema,
);
