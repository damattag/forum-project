import { NotAllowedException } from '@/core/exceptions/exceptions/not-allowed.exception';
import { makeAnswer } from 'test/factories/make-answer';
import { makeQuestion } from 'test/factories/make-question';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments.repository';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers.repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments.repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions.repository';
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer.usecase';

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: ChooseQuestionBestAnswerUseCase;

describe('Choose Question best answer', () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
		inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
		);
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository,
		);
		sut = new ChooseQuestionBestAnswerUseCase(
			inMemoryAnswersRepository,
			inMemoryQuestionsRepository,
		);
	});

	it('should be able to choose the question best answer', async () => {
		const newQuestion = makeQuestion();
		const newAnswer = makeAnswer({ questionId: newQuestion.id });

		inMemoryQuestionsRepository.create(newQuestion);
		inMemoryAnswersRepository.create(newAnswer);

		await sut.execute({
			answerId: newAnswer.id.toString(),
			authorId: newQuestion.authorId.toString(),
		});

		expect(inMemoryQuestionsRepository.items[0].bestAnswerId).toEqual(newAnswer.id);
	});

	it('should not be able to choose another user question best answer', async () => {
		const newQuestion = makeQuestion();
		const newAnswer = makeAnswer({ questionId: newQuestion.id });

		inMemoryQuestionsRepository.create(newQuestion);
		inMemoryAnswersRepository.create(newAnswer);

		await sut.execute({
			answerId: newAnswer.id.toString(),
			authorId: newQuestion.authorId.toString(),
		});

		const result = await sut.execute({
			answerId: newAnswer.id.toString(),
			authorId: 'another_author',
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedException);
	});
});
