import type { PaginationParams } from '@/core/repositories/pagination-params';
import type { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment.entity';

export abstract class QuestionCommentsRepository {
	abstract create(questionComment: QuestionComment): Promise<void>;
	abstract findById(id: string): Promise<QuestionComment | null>;
	abstract delete(questionComment: QuestionComment): Promise<void>;
	abstract listByQuestionId(
		questionId: string,
		params: PaginationParams,
	): Promise<QuestionComment[]>;
}
