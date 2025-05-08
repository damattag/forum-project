import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment.entity';
import { z } from 'zod';

const answerCommentResponseSchema = z.object({
	id: z.string(),
	content: z.string(),
	answer_id: z.string(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date().nullish(),
});

type AnswerCommentResponseSchema = z.infer<typeof answerCommentResponseSchema>;

export class AnswerCommentPresenter {
	static toHttp(answerComment: AnswerComment): AnswerCommentResponseSchema {
		return {
			id: answerComment.id.toString(),
			content: answerComment.content,
			answer_id: answerComment.answerId.toString(),
			created_at: answerComment.createdAt,
			updated_at: answerComment.updatedAt,
		};
	}
}
