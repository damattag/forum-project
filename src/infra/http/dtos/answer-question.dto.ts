import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod';

export const answerQuestionBodySchema = z.object({
	content: z.string(),
});

export type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>;

export const answerQuestionBodyValidationSchema = new ZodValidationPipe(
	answerQuestionBodySchema,
);

export const answerQuestionParamsSchema = z.object({
	question_id: z.string(),
});

export type AnswerQuestionParamsSchema = z.infer<typeof answerQuestionParamsSchema>;

export const answerQuestionParamsValidationSchema = new ZodValidationPipe(
	answerQuestionParamsSchema,
);
