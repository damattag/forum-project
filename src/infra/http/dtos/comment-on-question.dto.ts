import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod';

export const commentOnQuestionBodySchema = z.object({
	content: z.string(),
});

export type CommentOnQuestionBodySchema = z.infer<typeof commentOnQuestionBodySchema>;

export const commentOnQuestionBodyValidationSchema = new ZodValidationPipe(
	commentOnQuestionBodySchema,
);

export const commentOnQuestionParamsSchema = z.object({
	question_id: z.string(),
});

export type CommentOnQuestionParamsSchema = z.infer<typeof commentOnQuestionParamsSchema>;

export const commentOnQuestionParamsValidationSchema = new ZodValidationPipe(
	commentOnQuestionParamsSchema,
);
