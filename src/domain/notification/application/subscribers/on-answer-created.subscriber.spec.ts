import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification.usecase';
import { makeAnswer } from 'test/factories/make-answer';
import { makeQuestion } from 'test/factories/make-question';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments.repository';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers.repository';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments.repository';
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications.repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments.repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions.repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students.repository';
import { waitFor } from 'test/utils/wait-for';
import type { MockInstance } from 'vitest';
import { OnAnswerCreated } from './on-answer-created.subscriber';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sendNotificationUseCase: SendNotificationUseCase;
let notificationsRepository: InMemoryNotificationsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;

let sendNotificationExecuteSpy: MockInstance;

describe('On Answer Created', () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository,
		);

		inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
		inMemoryStudentsRepository = new InMemoryStudentsRepository();
		inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
			inMemoryAttachmentsRepository,
			inMemoryStudentsRepository,
		);
		notificationsRepository = new InMemoryNotificationsRepository();
		sendNotificationUseCase = new SendNotificationUseCase(notificationsRepository);

		sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute');

		new OnAnswerCreated(inMemoryQuestionsRepository, sendNotificationUseCase);
	});

	it('should be able to send a notification when a new answer is created', async () => {
		const question = makeQuestion();
		const answer = makeAnswer({ questionId: question.id });

		await inMemoryQuestionsRepository.create(question);
		await inMemoryAnswersRepository.create(answer);

		await waitFor(() => {
			expect(sendNotificationExecuteSpy).toHaveBeenCalled();
		});
	});
});
