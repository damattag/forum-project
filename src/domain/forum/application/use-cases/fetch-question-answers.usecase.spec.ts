import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeAnswer } from 'test/factories/make-answer';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers.repository';
import { FetchQuestionAnswersUseCase } from './fetch-question-answers.usecase';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments.repository';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: FetchQuestionAnswersUseCase;

describe('Fetch question answers', () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository,
		);
		sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository);
	});

	it('should be able to fetch question answers', async () => {
		await inMemoryAnswersRepository.create(
			makeAnswer({ questionId: new UniqueEntityId('1') }),
		);
		await inMemoryAnswersRepository.create(
			makeAnswer({ questionId: new UniqueEntityId('1') }),
		);
		await inMemoryAnswersRepository.create(
			makeAnswer({ questionId: new UniqueEntityId('1') }),
		);

		const result = await sut.execute({
			questionId: '1',
			page: 1,
		});

		expect(result.isRight()).toBeTruthy();
		expect(result.value?.answers).toHaveLength(3);
	});

	it('should be able to fetch paginated answers answers', async () => {
		for (let i = 0; i < 25; i++) {
			await inMemoryAnswersRepository.create(
				makeAnswer({ questionId: new UniqueEntityId('1') }),
			);
		}

		const result = await sut.execute({
			questionId: '1',
			page: 2,
		});

		expect(result.isRight()).toBeTruthy();
		expect(result.value?.answers).toHaveLength(5);
	});
});
