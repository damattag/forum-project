import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments.repository';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers.repository';
import { AnswerQuestionUseCase } from './answer-question.usecase';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: AnswerQuestionUseCase;

describe('Answer Question', () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository);
		sut = new AnswerQuestionUseCase(inMemoryAnswersRepository);
	});

	it('should be able to answer a question', async () => {
		const result = await sut.execute({
			instructorId: '1',
			questionId: '1',
			content: 'This is the answer content',
			attachmentsIds: ['1', '2'],
		});

		expect(result.isRight()).toBe(true);
		expect(inMemoryAnswersRepository.items[0]).toEqual(result.value?.answer);
		expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toHaveLength(2);
		expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
			expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
		]);
	});
});
