import { type Either, left, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundException } from '@/core/exceptions/exceptions/resource-not-found.exception';
import type { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments.repository';
import type { AnswersRepository } from '@/domain/forum/application/repositories/answers.repository';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment.entity';

interface CommentOnAnswerUseCaseRequest {
	authorId: string;
	answerId: string;
	content: string;
}

type CommentOnAnswerUseCaseResponse = Either<
	ResourceNotFoundException,
	{ answerComment: AnswerComment }
>;

export class CommentOnAnswerUseCase {
	constructor(
		private answersRepository: AnswersRepository,
		private answerCommentsRepository: AnswerCommentsRepository,
	) {}
	async execute({
		authorId,
		content,
		answerId,
	}: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
		const answer = await this.answersRepository.findById(answerId);

		if (!answer) {
			return left(new ResourceNotFoundException());
		}

		const answerComment = AnswerComment.create({
			authorId: new UniqueEntityId(authorId),
			content,
			answerId: new UniqueEntityId(answerId),
		});

		await this.answerCommentsRepository.create(answerComment);

		return right({
			answerComment,
		});
	}
}
