import { makeAttachment } from 'test/factories/make-attachment';
import { makeQuestion } from 'test/factories/make-question';
import { makeQuestionAttachment } from 'test/factories/make-question-attachment';
import { makeStudent } from 'test/factories/make-student';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments.repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments.repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions.repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students.repository';
import { GetQuestionBySlugUseCase } from './get-question-by-slug.usecase';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let sut: GetQuestionBySlugUseCase;

describe('Get Question By Slug', () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
		inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
		inMemoryStudentsRepository = new InMemoryStudentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
			inMemoryAttachmentsRepository,
			inMemoryStudentsRepository,
		);
		sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
	});

	it('should be able to get a question by slug', async () => {
		const student = makeStudent({
			name: 'John Doe',
		});

		const newQuestion = makeQuestion({
			authorId: student.id,
		});

		inMemoryStudentsRepository.items.push(student);

		await inMemoryQuestionsRepository.create(newQuestion);

		const attachment = makeAttachment({
			title: 'Attachment 1',
		});

		inMemoryAttachmentsRepository.items.push(attachment);

		const questionAttachment = makeQuestionAttachment({
			questionId: newQuestion.id,
			attachmentId: attachment.id,
		});

		inMemoryQuestionAttachmentsRepository.items.push(questionAttachment);

		const result = await sut.execute({
			slug: newQuestion.slug.value,
		});

		expect(result.value).toMatchObject({
			question: expect.objectContaining({
				title: newQuestion.title,
				content: newQuestion.content,
				authorId: newQuestion.authorId,
				author: student.name,
				attachments: [
					expect.objectContaining({
						title: attachment.title,
					}),
				],
			}),
		});
	});
});
