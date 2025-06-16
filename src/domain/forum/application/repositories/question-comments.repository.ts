import type { PaginationParams } from '@/core/repositories/pagination-params';
import type { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment.entity';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';

export abstract class QuestionCommentsRepository {
	abstract create(questionComment: QuestionComment): Promise<void>;
	abstract findById(id: string): Promise<QuestionComment | null>;
	abstract delete(questionComment: QuestionComment): Promise<void>;
	abstract listByQuestionId(
		questionId: string,
		params: PaginationParams,
	): Promise<QuestionComment[]>;
	abstract listByQuestionIdWithAuthor(
		questionId: string,
		params: PaginationParams,
	): Promise<CommentWithAuthor[]>;
}
