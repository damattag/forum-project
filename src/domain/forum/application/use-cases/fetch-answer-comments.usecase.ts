import { type Either, right } from '@/core/either';
import type { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments.repository';
import type { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment.entity';

interface FetchAnswerCommentsUseCaseRequest {
	answerId: string;
	page: number;
}

type FetchAnswerCommentsUseCaseResponse = Either<void, { answerComments: AnswerComment[] }>;

export class FetchAnswerCommentsUseCase {
	constructor(private answerCommentsRepository: AnswerCommentsRepository) {}
	async execute({
		answerId,
		page,
	}: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
		const answerComments = await this.answerCommentsRepository.listByAnswerId(answerId, {
			page,
		});

		return right({
			answerComments,
		});
	}
}
