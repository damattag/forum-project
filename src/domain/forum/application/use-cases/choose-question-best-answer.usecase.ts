import { type Either, left, right } from '@/core/either';
import { NotAllowedException } from '@/core/exceptions/exceptions/not-allowed.exception';
import { ResourceNotFoundException } from '@/core/exceptions/exceptions/resource-not-found.exception';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers.repository';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions.repository';
import { Question } from '@/domain/forum/enterprise/entities/question.entity';
import { Injectable } from '@nestjs/common';

interface ChooseQuestionBestAnswerUseCaseRequest {
	authorId: string;
	answerId: string;
}

type ChooseQuestionBestAnswerUseCaseResponse = Either<
	NotAllowedException | ResourceNotFoundException,
	{ question: Question }
>;

@Injectable()
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
			return left(new ResourceNotFoundException());
		}

		const question = await this.questionsRepository.findById(
			answer.questionId.toString(),
		);

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
