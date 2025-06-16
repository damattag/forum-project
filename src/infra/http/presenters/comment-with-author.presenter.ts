import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';

export class CommentWithAuthorPresenter {
	static toHttp(commentWithAuthor: CommentWithAuthor) {
		return {
			commentId: commentWithAuthor.commentId.toString(),
			content: commentWithAuthor.content,
			authorId: commentWithAuthor.authorId.toString(),
			author: commentWithAuthor.author,
			createdAt: commentWithAuthor.createdAt,
			updatedAt: commentWithAuthor.updatedAt,
		};
	}
}
