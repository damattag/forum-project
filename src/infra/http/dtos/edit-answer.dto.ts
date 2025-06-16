import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

export const editAnswerBodySchema = z
	.object({
		content: z.string(),
		attachments: z.array(z.string()),
	})
	.partial();
export const editAnswerParamsSchema = z.object({
	id: z.string(),
});

export type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>;
export type EditAnswerParamsSchema = z.infer<typeof editAnswerParamsSchema>;

export const editAnswerParamsValidationSchema = new ZodValidationPipe(
	editAnswerParamsSchema,
);

export const editAnswerBodyValidationSchema = new ZodValidationPipe(editAnswerBodySchema);
