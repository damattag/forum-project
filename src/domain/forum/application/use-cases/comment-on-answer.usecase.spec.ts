import { makeAnswer } from 'test/factories/make-answer';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments.repository';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments.repository';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers.repository';
import { CommentOnAnswerUseCase } from './comment-on-answer.usecase';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: CommentOnAnswerUseCase;

describe('Comment on answer', () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository,
		);
		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
		sut = new CommentOnAnswerUseCase(
			inMemoryAnswersRepository,
			inMemoryAnswerCommentsRepository,
		);
	});

	it('should be able to comment on answer', async () => {
		const answer = makeAnswer();

		await inMemoryAnswersRepository.create(answer);

		await sut.execute({
			authorId: answer.authorId.toString(),
			answerId: answer.id.toString(),
			content: 'Test comment',
		});

		expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual('Test comment');
	});
});
