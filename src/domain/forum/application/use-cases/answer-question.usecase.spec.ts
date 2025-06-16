import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments.repository';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers.repository';
import { AnswerQuestionUseCase } from './answer-question.usecase';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: AnswerQuestionUseCase;

describe('Answer Question (E2E)', () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository,
		);
		sut = new AnswerQuestionUseCase(inMemoryAnswersRepository);
	});

	it('should be able to answer a question', async () => {
		const result = await sut.execute({
			authorId: '1',
			questionId: '1',
			content: 'This is the answer content',
			attachmentIds: ['1', '2'],
		});

		expect(result.isRight()).toBe(true);
		expect(inMemoryAnswersRepository.items[0]).toEqual(result.value?.answer);
	});

	it('should persist attachments when a answer is created', async () => {
		const result = await sut.execute({
			authorId: '1',
			questionId: '1',
			content: 'This is the create content',
			attachmentIds: ['1', '2'],
		});

		expect(result.isRight()).toBe(true);
		expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(2);
		expect(inMemoryAnswerAttachmentsRepository.items).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
				expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
			]),
		);
	});
});
