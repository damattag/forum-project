import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { makeQuestionComment } from 'test/factories/make-question-comment';
import { makeStudent } from 'test/factories/make-student';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments.repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students.repository';
import { FetchQuestionCommentsUseCase } from './fetch-question-comments.usecase';

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: FetchQuestionCommentsUseCase;

describe('Fetch question comments', () => {
	beforeEach(() => {
		inMemoryStudentsRepository = new InMemoryStudentsRepository();

		inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
			inMemoryStudentsRepository,
		);
		sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository);
	});

	it('should be able to fetch question comments', async () => {
		const student = makeStudent({
			name: 'John Doe',
		});

		inMemoryStudentsRepository.items.push(student);

		await inMemoryQuestionCommentsRepository.create(
			makeQuestionComment({
				questionId: new UniqueEntityId('1'),
				authorId: student.id,
			}),
		);
		await inMemoryQuestionCommentsRepository.create(
			makeQuestionComment({
				questionId: new UniqueEntityId('1'),
				authorId: student.id,
			}),
		);
		await inMemoryQuestionCommentsRepository.create(
			makeQuestionComment({
				questionId: new UniqueEntityId('1'),
				authorId: student.id,
			}),
		);

		const result = await sut.execute({
			questionId: '1',
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

	it('should be able to fetch paginated question comments', async () => {
		const student = makeStudent({
			name: 'John Doe',
		});

		inMemoryStudentsRepository.items.push(student);

		for (let i = 0; i < 25; i++) {
			await inMemoryQuestionCommentsRepository.create(
				makeQuestionComment({
					questionId: new UniqueEntityId('1'),
					authorId: student.id,
				}),
			);
		}

		const result = await sut.execute({
			questionId: '1',
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
