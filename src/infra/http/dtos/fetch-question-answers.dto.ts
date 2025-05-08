import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

export const fetchQuestionAnswersParamsSchema = z.object({
	questionId: z.string().uuid(),
});

export const fetchQuestionAnswersQuerySchema = z.object({
	page: z.coerce.number().int().positive().optional().default(1),
	limit: z.coerce.number().int().positive().min(1).max(100).optional().default(10),
});

export type FetchQuestionAnswersParamsSchema = z.infer<
	typeof fetchQuestionAnswersParamsSchema
>;
export type FetchQuestionAnswersQuerySchema = z.infer<
	typeof fetchQuestionAnswersQuerySchema
>;

export const fetchQuestionAnswersParamsValidationSchema = new ZodValidationPipe(
	fetchQuestionAnswersParamsSchema,
);

export const fetchQuestionAnswersQueryValidationSchema = new ZodValidationPipe(
	fetchQuestionAnswersQuerySchema,
);
