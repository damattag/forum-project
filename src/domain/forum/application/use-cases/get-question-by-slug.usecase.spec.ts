import { makeQuestion } from 'test/factories/make-question';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments.repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions.repository';
import { GetQuestionBySlugUseCase } from './get-question-by-slug.usecase';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: GetQuestionBySlugUseCase;

describe('Get Question By Slug', () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
		);
		sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
	});

	it('should be able to get a question by slug', async () => {
		const newQuestion = makeQuestion();

		await inMemoryQuestionsRepository.create(newQuestion);

		const result = await sut.execute({
			slug: newQuestion.slug.value,
		});

		expect(result.value).toMatchObject({
			question: expect.objectContaining({
				title: newQuestion.title,
				content: newQuestion.content,
				authorId: newQuestion.authorId,
			}),
		});
	});
});
