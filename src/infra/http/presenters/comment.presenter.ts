import { Comment } from '@/domain/forum/enterprise/entities/comment.entity';
import { z } from 'zod';

const CommentResponseSchema = z.object({
	id: z.string(),
	content: z.string(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date().nullish(),
});

type CommentResponseSchema = z.infer<typeof CommentResponseSchema>;

export class CommentPresenter {
	static toHttp(comment: Comment<any>): CommentResponseSchema {
		return {
			id: comment.id.toString(),
			content: comment.content,
			created_at: comment.createdAt,
			updated_at: comment.updatedAt,
		};
	}
}
