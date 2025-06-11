import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

export const fetchAnswerCommentsParamsSchema = z.object({
	answer_id: z.string().uuid(),
});

export const fetchAnswerCommentsQuerySchema = z.object({
	page: z.coerce.number().int().positive().optional().default(1),
	limit: z.coerce.number().int().positive().min(1).max(100).optional().default(10),
});

export type FetchAnswerCommentsParamsSchema = z.infer<
	typeof fetchAnswerCommentsParamsSchema
>;
export type FetchAnswerCommentsQuerySchema = z.infer<
	typeof fetchAnswerCommentsQuerySchema
>;

export const fetchAnswerCommentsParamsValidationSchema = new ZodValidationPipe(
	fetchAnswerCommentsParamsSchema,
);

export const fetchAnswerCommentsQueryValidationSchema = new ZodValidationPipe(
	fetchAnswerCommentsQuerySchema,
);
