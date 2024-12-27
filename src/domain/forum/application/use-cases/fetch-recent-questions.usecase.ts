import { type Either, right } from '@/core/either';
import type { QuestionsRepository } from '@/domain/forum/application/repositories/questions.repository';
import type { Question } from '@/domain/forum/enterprise/entities/question.entity';

interface FetchRecentQuestionsUseCaseRequest {
	page: number;
}

type FetchRecentQuestionsUseCaseResponse = Either<void, { questions: Question[] }>;

export class FetchRecentQuestionsUseCase {
	constructor(private questionsRepository: QuestionsRepository) {}
	async execute({
		page,
	}: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
		const questions = await this.questionsRepository.listRecent({ page });

		return right({
			questions,
		});
	}
}
