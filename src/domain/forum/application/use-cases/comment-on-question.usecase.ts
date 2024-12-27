import { type Either, left, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundException } from '@/core/exceptions/exceptions/resource-not-found.exception';
import type { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments.repository';
import type { QuestionsRepository } from '@/domain/forum/application/repositories/questions.repository';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment.entity';

interface CommentOnQuestionUseCaseRequest {
	authorId: string;
	questionId: string;
	content: string;
}

type CommentOnQuestionUseCaseResponse = Either<
	ResourceNotFoundException,
	{ questionComment: QuestionComment }
>;

export class CommentOnQuestionUseCase {
	constructor(
		private questionsRepository: QuestionsRepository,
		private questionCommentsRepository: QuestionCommentsRepository,
	) {}
	async execute({
		authorId,
		content,
		questionId,
	}: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
		const question = await this.questionsRepository.findById(questionId);

		if (!question) {
			return left(new ResourceNotFoundException());
		}

		const questionComment = QuestionComment.create({
			authorId: new UniqueEntityId(authorId),
			content,
			questionId: new UniqueEntityId(questionId),
		});

		await this.questionCommentsRepository.create(questionComment);

		return right({
			questionComment,
		});
	}
}
