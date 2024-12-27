import { type Either, left, right } from '@/core/either';
import { NotAllowedException } from '@/core/exceptions/exceptions/not-allowed.exception';
import { ResourceNotFoundException } from '@/core/exceptions/exceptions/resource-not-found.exception';
import type { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments.repository';

interface DeleteAnswerCommentUseCaseRequest {
	authorId: string;
	answerCommentId: string;
}

type DeleteAnswerCommentUseCaseResponse = Either<
	ResourceNotFoundException | NotAllowedException,
	void
>;

export class DeleteAnswerCommentUseCase {
	constructor(private answerCommentsRepository: AnswerCommentsRepository) {}
	async execute({
		authorId,
		answerCommentId,
	}: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
		const answerComment = await this.answerCommentsRepository.findById(answerCommentId);

		if (!answerComment) {
			return left(new ResourceNotFoundException());
		}

		if (answerComment.authorId.toString() !== authorId) {
			return left(new NotAllowedException());
		}

		await this.answerCommentsRepository.delete(answerComment);

		return right(void 0);
	}
}
