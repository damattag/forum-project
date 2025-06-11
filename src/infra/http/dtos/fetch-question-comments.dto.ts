import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

export const fetchQuestionCommentsParamsSchema = z.object({
	questionId: z.string().uuid(),
});

export const fetchQuestionCommentsQuerySchema = z.object({
	page: z.coerce.number().int().positive().optional().default(1),
	limit: z.coerce.number().int().positive().min(1).max(100).optional().default(10),
});

export type FetchQuestionCommentsParamsSchema = z.infer<
	typeof fetchQuestionCommentsParamsSchema
>;
export type FetchQuestionCommentsQuerySchema = z.infer<
	typeof fetchQuestionCommentsQuerySchema
>;

export const fetchQuestionCommentsParamsValidationSchema = new ZodValidationPipe(
	fetchQuestionCommentsParamsSchema,
);

export const fetchQuestionCommentsQueryValidationSchema = new ZodValidationPipe(
	fetchQuestionCommentsQuerySchema,
);
