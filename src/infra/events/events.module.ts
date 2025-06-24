import { OnAnswerCreated } from '@/domain/notification/application/subscribers/on-answer-created.subscriber';
import { OnQuestionBestAnswerChosen } from '@/domain/notification/application/subscribers/on-question-best-answer-chosen.subscriber';
import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification.usecase';
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification.usecase';
import { DatabaseModule } from '@/infra/database/database.module';
import { Module } from '@nestjs/common';

@Module({
	imports: [DatabaseModule],
	providers: [
		OnAnswerCreated,
		OnQuestionBestAnswerChosen,
		SendNotificationUseCase,
		ReadNotificationUseCase,
	],
})
export class EventsModule {}
