import type { PaginationParams } from '@/core/repositories/pagination-params';
import type { Question } from '@/domain/forum/enterprise/entities/question.entity';

export abstract class QuestionsRepository {
	abstract findById(id: string): Promise<Question | null>;
	abstract create(question: Question): Promise<void>;
	abstract findBySlug(slug: string): Promise<Question | null>;
	abstract delete(question: Question): Promise<void>;
	abstract save(question: Question): Promise<void>;
	abstract listRecent(params: PaginationParams): Promise<Question[]>;
}
