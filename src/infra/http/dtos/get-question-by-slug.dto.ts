import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod';

export const getQuestionBySlugParamsSchema = z.object({
	slug: z.string(),
});

export type GetQuestionBySlugParamsSchema = z.infer<typeof getQuestionBySlugParamsSchema>;

export const getQuestionBySlugParamsValidationSchema = new ZodValidationPipe(
	getQuestionBySlugParamsSchema,
);
