import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeAnswerComment } from 'test/factories/make-answer-comment';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments.repository';
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments.usecase';

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: FetchAnswerCommentsUseCase;

describe('Fetch answer comments', () => {
	beforeEach(() => {
		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
		sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
	});

	it('should be able to fetch answer comments', async () => {
		await inMemoryAnswerCommentsRepository.create(
			makeAnswerComment({ answerId: new UniqueEntityId('1') }),
		);
		await inMemoryAnswerCommentsRepository.create(
			makeAnswerComment({ answerId: new UniqueEntityId('1') }),
		);
		await inMemoryAnswerCommentsRepository.create(
			makeAnswerComment({ answerId: new UniqueEntityId('1') }),
		);

		const result = await sut.execute({
			answerId: '1',
			page: 1,
		});

		expect(result.isRight()).toBeTruthy();
		expect(result.value?.answerComments).toHaveLength(3);
	});

	it('should be able to fetch paginated answer comments', async () => {
		for (let i = 0; i < 25; i++) {
			await inMemoryAnswerCommentsRepository.create(
				makeAnswerComment({ answerId: new UniqueEntityId('1') }),
			);
		}

		const result = await sut.execute({
			answerId: '1',
			page: 2,
		});

		expect(result.isRight()).toBeTruthy();
		expect(result.value?.answerComments).toHaveLength(5);
	});
});
