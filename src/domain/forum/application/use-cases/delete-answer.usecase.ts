import { type Either, left, right } from '@/core/either';
import { NotAllowedException } from '@/core/exceptions/exceptions/not-allowed.exception';
import { ResourceNotFoundException } from '@/core/exceptions/exceptions/resource-not-found.exception';
import type { AnswersRepository } from '../repositories/answers.repository';

interface DeleteAnswerUseCaseRequest {
	answerId: string;
	authorId: string;
}

type DeleteAnswerUseCaseResponse = Either<ResourceNotFoundException | NotAllowedException, void>;

export class DeleteAnswerUseCase {
	constructor(private answersRepository: AnswersRepository) {}
	async execute({
		answerId,
		authorId,
	}: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
		const answer = await this.answersRepository.findById(answerId);

		if (!answer) {
			return left(new ResourceNotFoundException());
		}

		if (answer.authorId.toString() !== authorId) {
			return left(new NotAllowedException());
		}

		await this.answersRepository.delete(answer);

		return right(void 0);
	}
}
