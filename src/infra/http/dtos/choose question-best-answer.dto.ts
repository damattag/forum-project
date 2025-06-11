import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

export const chooseQuestionBestAnswerParamsSchema = z.object({
	answer_id: z.string(),
});

export const chooseQuestionBestAnswerParamsValidationSchema = new ZodValidationPipe(
	chooseQuestionBestAnswerParamsSchema,
);

export type ChooseQuestionBestAnswerParamsSchema = z.infer<
	typeof chooseQuestionBestAnswerParamsSchema
>;
