import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod';

export const editQuestionBodySchema = z
	.object({
		title: z.string(),
		content: z.string(),
	})
	.partial();

export type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>;

export const editQuestionBodyValidationSchema = new ZodValidationPipe(
	editQuestionBodySchema,
);

export const editQuestionParamsSchema = z.object({
	id: z.string(),
});

export type EditQuestionParamsSchema = z.infer<typeof editQuestionParamsSchema>;

export const editQuestionParamsValidationSchema = new ZodValidationPipe(
	editQuestionParamsSchema,
);
