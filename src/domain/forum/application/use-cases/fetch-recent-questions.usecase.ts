import { type Either, right } from '@/core/either';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions.repository';
import type { Question } from '@/domain/forum/enterprise/entities/question.entity';
import { Injectable } from '@nestjs/common';

interface FetchRecentQuestionsUseCaseRequest {
	page: number;
	limit: number;
}

type FetchRecentQuestionsUseCaseResponse = Either<void, { questions: Question[] }>;

@Injectable()
export class FetchRecentQuestionsUseCase {
	constructor(private questionsRepository: QuestionsRepository) {}
	async execute({
		page,
		limit,
	}: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
		const questions = await this.questionsRepository.listRecent({ page, limit });

		return right({
			questions,
		});
	}
}
