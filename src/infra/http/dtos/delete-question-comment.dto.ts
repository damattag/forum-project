import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod';

export const deleteQuestionCommentParamsSchema = z.object({
	id: z.string(),
});

export type DeleteQuestionCommentParamsSchema = z.infer<
	typeof deleteQuestionCommentParamsSchema
>;

export const deleteQuestionCommentParamsValidationSchema = new ZodValidationPipe(
	deleteQuestionCommentParamsSchema,
);
