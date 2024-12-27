import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question.usecase';
import { DatabaseModule } from '@/infra/database/database.module';
import { Module } from '@nestjs/common';
import { AuthenticateController } from './controllers/authenticate.controller';
import { CreateAccountController } from './controllers/create-account.controller';
import { CreateQuestionController } from './controllers/create-question.controller';
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions.usecase';

@Module({
	imports: [DatabaseModule],
	controllers: [
		CreateAccountController,
		AuthenticateController,
		CreateQuestionController,
		FetchRecentQuestionsController,
	],
	providers: [CreateQuestionUseCase, FetchRecentQuestionsUseCase],
})
export class HttpModule {}
