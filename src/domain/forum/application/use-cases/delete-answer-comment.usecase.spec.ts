import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedException } from '@/core/exceptions/exceptions/not-allowed.exception';
import { makeAnswerComment } from 'test/factories/make-answer-comment';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments.repository';
import { DeleteAnswerCommentUseCase } from './delete-answer-comment.usecase';

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: DeleteAnswerCommentUseCase;

describe('Delete answer comment', () => {
	beforeEach(() => {
		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
		sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository);
	});

	it('should be able to delete answer comment', async () => {
		const answerComment = makeAnswerComment();

		await inMemoryAnswerCommentsRepository.create(answerComment);

		await sut.execute({
			authorId: answerComment.authorId.toString(),
			answerCommentId: answerComment.id.toString(),
		});

		expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0);
	});

	it('should not be able to delete another user answer comment', async () => {
		const answerComment = makeAnswerComment({ authorId: new UniqueEntityId('user_1') });

		await inMemoryAnswerCommentsRepository.create(answerComment);

		const result = await sut.execute({
			authorId: 'another-user-id',
			answerCommentId: answerComment.id.toString(),
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedException);
	});
});
