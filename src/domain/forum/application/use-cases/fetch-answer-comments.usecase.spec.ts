import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeAnswerComment } from 'test/factories/make-answer-comment';
import { makeStudent } from 'test/factories/make-student';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments.repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students.repository';
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments.usecase';

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: FetchAnswerCommentsUseCase;

describe('Fetch answer comments', () => {
	beforeEach(() => {
		inMemoryStudentsRepository = new InMemoryStudentsRepository();
		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
			inMemoryStudentsRepository,
		);
		sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
	});

	it('should be able to fetch answer comments', async () => {
		const student = makeStudent({
			name: 'John Doe',
		});

		inMemoryStudentsRepository.items.push(student);

		await inMemoryAnswerCommentsRepository.create(
			makeAnswerComment({
				answerId: new UniqueEntityId('1'),
				authorId: student.id,
			}),
		);
		await inMemoryAnswerCommentsRepository.create(
			makeAnswerComment({
				answerId: new UniqueEntityId('1'),
				authorId: student.id,
			}),
		);
		await inMemoryAnswerCommentsRepository.create(
			makeAnswerComment({
				answerId: new UniqueEntityId('1'),
				authorId: student.id,
			}),
		);

		const result = await sut.execute({
			answerId: '1',
			page: 1,
			limit: 20,
		});

		expect(result.isRight()).toBeTruthy();
		expect(result.value?.comments).toHaveLength(3);
		expect(result.value?.comments).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					author: student.name,
				}),
			]),
		);
	});

	it('should be able to fetch paginated answer comments', async () => {
		const student = makeStudent({
			name: 'John Doe',
		});

		inMemoryStudentsRepository.items.push(student);

		for (let i = 0; i < 25; i++) {
			await inMemoryAnswerCommentsRepository.create(
				makeAnswerComment({
					answerId: new UniqueEntityId('1'),
					authorId: student.id,
				}),
			);
		}

		const result = await sut.execute({
			answerId: '1',
			page: 2,
			limit: 20,
		});

		expect(result.isRight()).toBeTruthy();
		expect(result.value?.comments).toHaveLength(5);
		expect(result.value?.comments).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					author: student.name,
				}),
			]),
		);
	});
});
