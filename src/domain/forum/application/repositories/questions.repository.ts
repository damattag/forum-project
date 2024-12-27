import type { PaginationParams } from '@/core/repositories/pagination-params';
import type { Question } from '@/domain/forum/enterprise/entities/question.entity';

export interface QuestionsRepository {
	findById(id: string): Promise<Question | null>;
	create(question: Question): Promise<void>;
	findBySlug(slug: string): Promise<Question | null>;
	delete(question: Question): Promise<void>;
	save(question: Question): Promise<void>;
	listRecent(params: PaginationParams): Promise<Question[]>;
}
