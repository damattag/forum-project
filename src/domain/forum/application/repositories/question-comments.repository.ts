import type { PaginationParams } from '@/core/repositories/pagination-params';
import type { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment.entity';

export interface QuestionCommentsRepository {
	create(questionComment: QuestionComment): Promise<void>;
	findById(id: string): Promise<QuestionComment | null>;
	delete(questionComment: QuestionComment): Promise<void>;
	listByQuestionId(questionId: string, params: PaginationParams): Promise<QuestionComment[]>;
}
