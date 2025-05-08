import { Answer } from '@/domain/forum/enterprise/entities/answer.entity';
import { z } from 'zod';

const answerResponseSchema = z.object({
	id: z.string(),
	content: z.string(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date().nullish(),
});

type AnswerResponseSchema = z.infer<typeof answerResponseSchema>;

export class AnswerPresenter {
	static toHttp(answer: Answer): AnswerResponseSchema {
		return {
			id: answer.id.toString(),
			content: answer.content,
			created_at: answer.createdAt,
			updated_at: answer.updatedAt,
		};
	}
}
