import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod';

export const deleteAnswerCommentParamsSchema = z.object({
	id: z.string(),
});

export type DeleteAnswerCommentParamsSchema = z.infer<
	typeof deleteAnswerCommentParamsSchema
>;

export const deleteAnswerCommentParamsValidationSchema = new ZodValidationPipe(
	deleteAnswerCommentParamsSchema,
);
