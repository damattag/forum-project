import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedException } from '@/core/exceptions/exceptions/not-allowed.exception';
import { makeAnswer } from 'test/factories/make-answer';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments.repository';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers.repository';
import { DeleteAnswerUseCase } from './delete-answer.usecase';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: DeleteAnswerUseCase;

describe('Delete Answer', () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository,
		);
		sut = new DeleteAnswerUseCase(inMemoryAnswersRepository);
	});

	it('should be able to delete a answer', async () => {
		const newAnswer = makeAnswer(
			{ authorId: new UniqueEntityId('author_1') },
			new UniqueEntityId('answer_1'),
		);

		inMemoryAnswersRepository.create(newAnswer);

		await sut.execute({
			answerId: 'answer_1',
			authorId: 'author_1',
		});

		expect(inMemoryAnswersRepository.items).toHaveLength(0);
	});

	it('should not be able to delete a answer from another author', async () => {
		const newAnswer = makeAnswer(
			{ authorId: new UniqueEntityId('author_1') },
			new UniqueEntityId('answer_1'),
		);

		inMemoryAnswersRepository.create(newAnswer);

		const result = await sut.execute({
			answerId: 'answer_1',
			authorId: 'another_author',
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedException);
	});
});
