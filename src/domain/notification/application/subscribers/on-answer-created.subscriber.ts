import { DomainEvents } from '@/core/events/domains-events';
import type { EventHandler } from '@/core/events/event-handler';
import type { QuestionsRepository } from '@/domain/forum/application/repositories/questions.repository';
import { AnswerCreatedEvent } from '@/domain/forum/enterprise/events/answer-created.event';
import type { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification.usecase';

export class OnAnswerCreated implements EventHandler {
	constructor(
		private questionsRepository: QuestionsRepository,
		private sendNotification: SendNotificationUseCase,
	) {
		this.setupSubscriptions();
	}

	setupSubscriptions(): void {
		DomainEvents.register(
			this.sendNewAnswerNotification.bind(this),
			AnswerCreatedEvent.name,
		);
	}

	private async sendNewAnswerNotification(event: AnswerCreatedEvent) {
		const question = await this.questionsRepository.findById(
			event.answer.questionId.toString(),
		);

		if (!question) {
			return;
		}

		await this.sendNotification.execute({
			title: `Uma nova resposta foi criada no tópico "${question.title
				.substring(0, 50)
				.concat('...')}"`,
			content: event.answer.excerpt,
			recipientId: question.authorId.toString(),
		});
	}
}
