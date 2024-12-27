import { type Either, left, right } from '@/core/either';
import { NotAllowedException } from '@/core/exceptions/exceptions/not-allowed.exception';
import { ResourceNotFoundException } from '@/core/exceptions/exceptions/resource-not-found.exception';
import type { AnswersRepository } from '@/domain/forum/application/repositories/answers.repository';
import type { QuestionsRepository } from '@/domain/forum/application/repositories/questions.repository';
import type { Question } from '@/domain/forum/enterprise/entities/question.entity';

interface ChooseQuestionBestAnswerUseCaseRequest {
	authorId: string;
	answerId: string;
}

type ChooseQuestionBestAnswerUseCaseResponse = Either<
	NotAllowedException | ResourceNotFoundException,
	{ question: Question }
>;

export class ChooseQuestionBestAnswerUseCase {
	constructor(
		private answersRepository: AnswersRepository,
		private questionsRepository: QuestionsRepository,
	) {}

	async execute({
		answerId,
		authorId,
	}: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
		const answer = await this.answersRepository.findById(answerId);

		if (!answer) {
			throw new Error('Answer not found');
		}

		const question = await this.questionsRepository.findById(answer.questionId.toString());

		if (!question) {
			return left(new ResourceNotFoundException());
		}

		if (question.authorId.toString() !== authorId) {
			return left(new NotAllowedException());
		}

		question.bestAnswerId = answer.id;

		await this.questionsRepository.save(question);

		return right({ question });
	}
}
