import { DomainEvents } from '@/core/events/domains-events';
import type { EventHandler } from '@/core/events/event-handler';
import type { AnswersRepository } from '@/domain/forum/application/repositories/answers.repository';
import { QuestionBestAnswerChosenEvent } from '@/domain/forum/enterprise/events/question-best-answer-chosen.event';
import type { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification.usecase';

export class OnQuestionBestAnswerChosen implements EventHandler {
	constructor(
		private answersRepository: AnswersRepository,
		private sendNotification: SendNotificationUseCase,
	) {
		this.setupSubscriptions();
	}

	setupSubscriptions(): void {
		DomainEvents.register(
			this.sendQuestBestAnswerNotification.bind(this),
			QuestionBestAnswerChosenEvent.name,
		);
	}

	private async sendQuestBestAnswerNotification(event: QuestionBestAnswerChosenEvent) {
		const answer = await this.answersRepository.findById(event.bestAnswerId.toString());

		if (!answer) {
			return;
		}

		await this.sendNotification.execute({
			title: 'Sua resposta foi escolhida!',
			content: `A resposta que você enviou em "${event.question.title
				.substring(0, 20)
				.concat('...')}" foi escolhida pelo autor.`,
			recipientId: answer.authorId.toString(),
		});
	}
}
