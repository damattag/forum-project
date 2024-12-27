import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedException } from '@/core/exceptions/exceptions/not-allowed.exception';
import { makeQuestion } from 'test/factories/make-question';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments.repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions.repository';
import { DeleteQuestionUseCase } from './delete-question.usecase';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: DeleteQuestionUseCase;

describe('Delete Question', () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
		);
		sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository);
	});

	it('should be able to delete a question', async () => {
		const newQuestion = makeQuestion(
			{ authorId: new UniqueEntityId('author_1') },
			new UniqueEntityId('question_1'),
		);

		inMemoryQuestionsRepository.create(newQuestion);

		await sut.execute({
			questionId: newQuestion.id.toString(),
			authorId: 'author_1',
		});

		expect(inMemoryQuestionsRepository.items).toHaveLength(0);
	});

	it('should not be able to delete a question from another author', async () => {
		const newQuestion = makeQuestion({ authorId: new UniqueEntityId('author_1') });

		inMemoryQuestionsRepository.create(newQuestion);

		const result = await sut.execute({
			questionId: newQuestion.id.toString(),
			authorId: 'another_author',
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedException);
	});
});
