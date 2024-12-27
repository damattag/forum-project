import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeQuestionComment } from 'test/factories/make-question-comment';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments.repository';
import { FetchQuestionCommentsUseCase } from './fetch-question-comments.usecase';

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: FetchQuestionCommentsUseCase;

describe('Fetch question comments', () => {
	beforeEach(() => {
		inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository();
		sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository);
	});

	it('should be able to fetch question comments', async () => {
		await inMemoryQuestionCommentsRepository.create(
			makeQuestionComment({ questionId: new UniqueEntityId('1') }),
		);
		await inMemoryQuestionCommentsRepository.create(
			makeQuestionComment({ questionId: new UniqueEntityId('1') }),
		);
		await inMemoryQuestionCommentsRepository.create(
			makeQuestionComment({ questionId: new UniqueEntityId('1') }),
		);

		const result = await sut.execute({
			questionId: '1',
			page: 1,
		});

		expect(result.isRight()).toBeTruthy();
		expect(result.value?.questionComments).toHaveLength(3);
	});

	it('should be able to fetch paginated question comments', async () => {
		for (let i = 0; i < 25; i++) {
			await inMemoryQuestionCommentsRepository.create(
				makeQuestionComment({ questionId: new UniqueEntityId('1') }),
			);
		}

		const result = await sut.execute({
			questionId: '1',
			page: 2,
		});

		expect(result.isRight()).toBeTruthy();
		expect(result.value?.questionComments).toHaveLength(5);
	});
});
