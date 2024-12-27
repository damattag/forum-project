import { type Either, right } from '@/core/either';
import type { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments.repository';
import type { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment.entity';

interface FetchQuestionCommentsUseCaseRequest {
	questionId: string;
	page: number;
	limit: number;
}

type FetchQuestionCommentsUseCaseResponse = Either<
	void,
	{ questionComments: QuestionComment[] }
>;

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
