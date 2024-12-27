import { type Either, left, right } from '@/core/either';
import { NotAllowedException } from '@/core/exceptions/exceptions/not-allowed.exception';
import { ResourceNotFoundException } from '@/core/exceptions/exceptions/resource-not-found.exception';
import type { QuestionsRepository } from '@/domain/forum/application/repositories/questions.repository';

interface DeleteQuestionUseCaseRequest {
	questionId: string;
	authorId: string;
}

type DeleteQuestionUseCaseResponse = Either<ResourceNotFoundException | NotAllowedException, void>;

export class DeleteQuestionUseCase {
	constructor(private questionsRepository: QuestionsRepository) {}
	async execute({
		questionId,
		authorId,
	}: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
		const question = await this.questionsRepository.findById(questionId);

		if (!question) {
			return left(new ResourceNotFoundException());
		}

		if (question.authorId.toString() !== authorId) {
			return left(new NotAllowedException());
		}

		await this.questionsRepository.delete(question);

		return right(void 0);
	}
}
