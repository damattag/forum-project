import { type Either, right } from '@/core/either';
import type { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments.repository';
import type { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment.entity';

interface FetchQuestionCommentsUseCaseRequest {
	questionId: string;
	page: number;
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
	}: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
		const questionComments = await this.questionCommentsRepository.listByQuestionId(
			questionId,
			{
				page,
			},
		);

		return right({
			questionComments,
		});
	}
}
