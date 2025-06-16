import { makeQuestion } from 'test/factories/make-question';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments.repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments.repository';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments.repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions.repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students.repository';
import { CommentOnQuestionUseCase } from './comment-on-question.usecase';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let sut: CommentOnQuestionUseCase;

describe('Comment on question', () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
		inMemoryStudentsRepository = new InMemoryStudentsRepository();
		inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
			inMemoryStudentsRepository,
		);
		inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
			inMemoryAttachmentsRepository,
			inMemoryStudentsRepository,
		);
		sut = new CommentOnQuestionUseCase(
			inMemoryQuestionsRepository,
			inMemoryQuestionCommentsRepository,
		);
	});

	it('should be able to comment on question', async () => {
		const question = makeQuestion();

		await inMemoryQuestionsRepository.create(question);

		await sut.execute({
			authorId: question.authorId.toString(),
			questionId: question.id.toString(),
			content: 'Test comment',
		});

		expect(inMemoryQuestionCommentsRepository.items[0].content).toEqual('Test comment');
	});
});
