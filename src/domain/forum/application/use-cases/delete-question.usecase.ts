import { type Either, left, right } from '@/core/either';
import { NotAllowedException } from '@/core/exceptions/exceptions/not-allowed.exception';
import { ResourceNotFoundException } from '@/core/exceptions/exceptions/resource-not-found.exception';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions.repository';
import { Injectable } from '@nestjs/common';

interface DeleteQuestionUseCaseRequest {
	questionId: string;
	authorId: string;
}

type DeleteQuestionUseCaseResponse = Either<
	ResourceNotFoundException | NotAllowedException,
	void
>;

@Injectable()
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
