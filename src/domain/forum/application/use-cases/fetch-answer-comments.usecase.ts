import { type Either, right } from '@/core/either';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments.repository';
import { Injectable } from '@nestjs/common';
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author';
interface FetchAnswerCommentsUseCaseRequest {
	answerId: string;
	page: number;
	limit: number;
}

type FetchAnswerCommentsUseCaseResponse = Either<void, { comments: CommentWithAuthor[] }>;

@Injectable()
export class FetchAnswerCommentsUseCase {
	constructor(private answerCommentsRepository: AnswerCommentsRepository) {}
	async execute({
		answerId,
		page,
		limit,
	}: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
		const answerComments = await this.answerCommentsRepository.listByAnswerIdWithAuthor(
			answerId,
			{
				page,
				limit,
			},
		);

		return right({
			comments: answerComments,
		});
	}
}
