import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod';

export const commentOnAnswerBodySchema = z.object({
	content: z.string(),
});

export type CommentOnAnswerBodySchema = z.infer<typeof commentOnAnswerBodySchema>;

export const commentOnAnswerBodyValidationSchema = new ZodValidationPipe(
	commentOnAnswerBodySchema,
);

export const commentOnAnswerParamsSchema = z.object({
	answer_id: z.string(),
});

export type CommentOnAnswerParamsSchema = z.infer<typeof commentOnAnswerParamsSchema>;

export const commentOnAnswerParamsValidationSchema = new ZodValidationPipe(
	commentOnAnswerParamsSchema,
);
