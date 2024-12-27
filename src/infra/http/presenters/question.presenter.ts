import { Question } from '@/domain/forum/enterprise/entities/question.entity';
import { z } from 'zod';

const questionResponseSchema = z.object({
	id: z.string(),
	title: z.string(),
	content: z.string(),
	author_id: z.string().uuid(),
	slug: z.string(),
	best_answer_id: z.string().uuid().nullish(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date().nullish(),
});

type QuestionResponseSchema = z.infer<typeof questionResponseSchema>;

export class QuestionPresenter {
	static toHttp(question: Question): QuestionResponseSchema {
		return {
			id: question.id.toString(),
			title: question.title,
			slug: question.slug.value,
			content: question.content,
			author_id: question.authorId.toString(),
			best_answer_id: question.bestAnswerId?.toString() ?? null,
			created_at: question.createdAt,
			updated_at: question.updatedAt,
		};
	}
}
