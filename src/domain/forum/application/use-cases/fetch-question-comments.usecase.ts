import { type Either, right } from '@/core/either';
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments.repository';
import type { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment.entity';
import { Injectable } from '@nestjs/common';

interface FetchQuestionCommentsUseCaseRequest {
	questionId: string;
	page: number;
	limit: number;
}

type FetchQuestionCommentsUseCaseResponse = Either<
	void,
	{ questionComments: QuestionComment[] }
>;

@Injectable()
export class FetchQuestionCommentsUseCase {
	constructor(private questionCommentsRepository: QuestionCommentsRepository) {}
	async execute({
		questionId,
		page,
		limit,
	}: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
		const questionComments = await this.questionCommentsRepository.listByQuestionId(
			questionId,
			{
				page,
				limit,
			},
		);

		return right({
			questionComments,
		});
	}
}
