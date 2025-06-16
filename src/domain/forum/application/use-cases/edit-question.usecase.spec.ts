import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedException } from '@/core/exceptions/exceptions/not-allowed.exception';
import { makeQuestion } from 'test/factories/make-question';
import { makeQuestionAttachment } from 'test/factories/make-question-attachment';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments.repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments.repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions.repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students.repository';
import { EditQuestionUseCase } from './edit-question.usecase';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let sut: EditQuestionUseCase;

describe('Edit Question', () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
		inMemoryStudentsRepository = new InMemoryStudentsRepository();
		inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();

		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
			inMemoryAttachmentsRepository,
			inMemoryStudentsRepository,
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

	it('should persist attachments when a question is edited', async () => {
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

		const result = await sut.execute({
			questionId: newQuestion.id.toString(),
			authorId: 'author_1',
			title: 'New Title',
			content: 'New Content',
			attachmentsIds: ['1', '3'],
		});

		expect(result.isRight()).toBe(true);
		expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(2);
		expect(inMemoryQuestionAttachmentsRepository.items).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
				expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
			]),
		);
	});
});
