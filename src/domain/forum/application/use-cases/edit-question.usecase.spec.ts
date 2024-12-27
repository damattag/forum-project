import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedException } from '@/core/exceptions/exceptions/not-allowed.exception';
import { makeQuestion } from 'test/factories/make-question';
import { makeQuestionAttachment } from 'test/factories/make-question-attachment';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments.repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions.repository';
import { EditQuestionUseCase } from './edit-question.usecase';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: EditQuestionUseCase;

describe('Edit Question', () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
		);
		sut = new EditQuestionUseCase(
			inMemoryQuestionsRepository,
			inMemoryQuestionAttachmentsRepository,
		);
	});

	it('should be able to edit a question', async () => {
		const newQuestion = makeQuestion(
			{ authorId: new UniqueEntityId('author_1') },
			new UniqueEntityId('question_1'),
		);

		inMemoryQuestionsRepository.create(newQuestion);

		inMemoryQuestionAttachmentsRepository.items.push(
			makeQuestionAttachment({
				attachmentId: new UniqueEntityId('1'),
				questionId: newQuestion.id,
			}),
			makeQuestionAttachment({
				attachmentId: new UniqueEntityId('2'),
				questionId: newQuestion.id,
			}),
		);

		await sut.execute({
			questionId: newQuestion.id.toString(),
			authorId: 'author_1',
			title: 'New Title',
			content: 'New Content',
			attachmentsIds: ['1', '3'],
		});

		expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
			title: 'New Title',
			content: 'New Content',
		});
		expect(inMemoryQuestionsRepository.items[0].attachments.currentItems).toHaveLength(2);
		expect(inMemoryQuestionsRepository.items[0].attachments.currentItems).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
			expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
		]);
	});

	it('should not be able to edit a question from another author', async () => {
		const newQuestion = makeQuestion(
			{ authorId: new UniqueEntityId('author_1') },
			new UniqueEntityId('question_1'),
		);

		inMemoryQuestionsRepository.create(newQuestion);

		const result = await sut.execute({
			questionId: newQuestion.id.toString(),
			authorId: 'another_author',
			title: 'New Title',
			content: 'New Content',
			attachmentsIds: [],
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedException);
	});
});
