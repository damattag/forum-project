import { type Either, right } from '@/core/either';
import type { AnswersRepository } from '@/domain/forum/application/repositories/answers.repository';
import type { Answer } from '@/domain/forum/enterprise/entities/answer.entity';

interface FetchQuestionAnswersUseCaseRequest {
	questionId: string;
	page: number;
	limit: number;
}

type FetchQuestionAnswersUseCaseResponse = Either<void, { answers: Answer[] }>;

export class FetchQuestionAnswersUseCase {
	constructor(private answerRepository: AnswersRepository) {}
	async execute({
		questionId,
		page,
		limit,
	}: FetchQuestionAnswersUseCaseRequest): Promise<FetchQuestionAnswersUseCaseResponse> {
		const answers = await this.answerRepository.listByQuestionId(questionId, {
			page,
			limit,
		});

		return right({
			answers,
		});
	}
}
