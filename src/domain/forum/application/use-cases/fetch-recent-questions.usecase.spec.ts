import { makeQuestion } from 'test/factories/make-question';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments.repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments.repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions.repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students.repository';
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions.usecase';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let sut: FetchRecentQuestionsUseCase;

describe('Fetch recent questions', () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
		inMemoryStudentsRepository = new InMemoryStudentsRepository();
		inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();

		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
			inMemoryAttachmentsRepository,
			inMemoryStudentsRepository,
		);
		sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository);
	});

	it('should be able to fetch recent questions', async () => {
		await inMemoryQuestionsRepository.create(
			makeQuestion({ createdAt: new Date(2024, 9, 7) }),
		);
		await inMemoryQuestionsRepository.create(
			makeQuestion({ createdAt: new Date(2024, 9, 8) }),
		);
		await inMemoryQuestionsRepository.create(
			makeQuestion({ createdAt: new Date(2024, 9, 9) }),
		);

		const result = await sut.execute({
			page: 1,
			limit: 20,
		});

		expect(result.value?.questions).toEqual([
			expect.objectContaining({ createdAt: new Date(2024, 9, 9) }),
			expect.objectContaining({ createdAt: new Date(2024, 9, 8) }),
			expect.objectContaining({ createdAt: new Date(2024, 9, 7) }),
		]);
	});

	it('should be able to fetch paginated recent questions', async () => {
		for (let i = 0; i < 25; i++) {
			await inMemoryQuestionsRepository.create(makeQuestion());
		}

		const result = await sut.execute({
			page: 2,
			limit: 20,
		});

		expect(result.value?.questions).toHaveLength(5);
	});
});
