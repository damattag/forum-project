import { type Either, left, right } from '@/core/either';
import { NotAllowedException } from '@/core/exceptions/exceptions/not-allowed.exception';
import { ResourceNotFoundException } from '@/core/exceptions/exceptions/resource-not-found.exception';
import type { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments.repository';

interface DeleteQuestionCommentUseCaseRequest {
	authorId: string;
	questionCommentId: string;
}

type DeleteQuestionCommentUseCaseResponse = Either<
	ResourceNotFoundException | NotAllowedException,
	void
>;

export class DeleteQuestionCommentUseCase {
	constructor(private questionCommentsRepository: QuestionCommentsRepository) {}
	async execute({
		authorId,
		questionCommentId,
	}: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
		const questionComment =
			await this.questionCommentsRepository.findById(questionCommentId);

		if (!questionComment) {
			return left(new ResourceNotFoundException());
		}

		if (questionComment.authorId.toString() !== authorId)
			return left(new NotAllowedException());

		await this.questionCommentsRepository.delete(questionComment);

		return right(void 0);
	}
}
