import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedException } from '@/core/exceptions/exceptions/not-allowed.exception';
import { makeQuestionComment } from 'test/factories/make-question-comment';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments.repository';
import { DeleteQuestionCommentUseCase } from './delete-question-comment.usecase';

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: DeleteQuestionCommentUseCase;

describe('Delete question comment', () => {
	beforeEach(() => {
		inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository();
		sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository);
	});

	it('should be able to delete question comment', async () => {
		const questionComment = makeQuestionComment();

		await inMemoryQuestionCommentsRepository.create(questionComment);

		await sut.execute({
			authorId: questionComment.authorId.toString(),
			questionCommentId: questionComment.id.toString(),
		});

		expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0);
	});

	it('should not be able to delete another user question comment', async () => {
		const questionComment = makeQuestionComment({ authorId: new UniqueEntityId('user_1') });

		await inMemoryQuestionCommentsRepository.create(questionComment);

		const result = await sut.execute({
			authorId: 'another-user-id',
			questionCommentId: questionComment.id.toString(),
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedException);
	});
});
