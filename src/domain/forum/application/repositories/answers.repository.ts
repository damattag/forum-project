import type { PaginationParams } from '@/core/repositories/pagination-params';
import type { Answer } from '@/domain/forum/enterprise/entities/answer.entity';

export abstract class AnswersRepository {
	abstract create(answer: Answer): Promise<void>;
	abstract delete(answer: Answer): Promise<void>;
	abstract findById(id: string): Promise<Answer | null>;
	abstract save(answer: Answer): Promise<void>;
	abstract listByQuestionId(
		questionId: string,
		params: PaginationParams,
	): Promise<Answer[]>;
}
