import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedException } from '@/core/exceptions/exceptions/not-allowed.exception';
import { makeAnswer } from 'test/factories/make-answer';
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments.repository';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers.repository';
import { EditAnswerUseCase } from './edit-answer.usecase';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: EditAnswerUseCase;

describe('Edit Answer', () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository);
		sut = new EditAnswerUseCase(inMemoryAnswersRepository, inMemoryAnswerAttachmentsRepository);
	});

	it('should be able to edit a answer', async () => {
		const newAnswer = makeAnswer(
			{ authorId: new UniqueEntityId('author_1') },
			new UniqueEntityId('answer_1'),
		);

		inMemoryAnswersRepository.create(newAnswer);

		inMemoryAnswerAttachmentsRepository.items.push(
			makeAnswerAttachment({ attachmentId: new UniqueEntityId('1'), answerId: newAnswer.id }),
			makeAnswerAttachment({ attachmentId: new UniqueEntityId('2'), answerId: newAnswer.id }),
		);

		await sut.execute({
			answerId: newAnswer.id.toString(),
			authorId: 'author_1',
			content: 'New Content',
			attachmentsIds: ['1', '3'],
		});

		expect(inMemoryAnswersRepository.items[0]).toMatchObject({
			content: 'New Content',
		});
		expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toHaveLength(2);
		expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
			expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
		]);
	});

	it('should not be able to edit a answer from another author', async () => {
		const newAnswer = makeAnswer(
			{ authorId: new UniqueEntityId('author_1') },
			new UniqueEntityId('answer_1'),
		);

		inMemoryAnswersRepository.create(newAnswer);

		const result = await sut.execute({
			answerId: newAnswer.id.toString(),
			authorId: 'another_author',
			content: 'New Content',
			attachmentsIds: [],
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedException);
	});
});
