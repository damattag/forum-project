import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student.usecase';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question.usecase';
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question.usecase';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions.usecase';
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug.usecase';
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student.usecase';
import { CryptographyModule } from '@/infra/cryptography/cryptography.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { Module } from '@nestjs/common';
import { AuthenticateController } from './controllers/authenticate.controller';
import { CreateAccountController } from './controllers/create-account.controller';
import { CreateQuestionController } from './controllers/create-question.controller';
import { EditQuestionController } from './controllers/edit-question.controller';
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller';
import { GetQuestionBySlugController } from './controllers/get-question-by-slug.controller';

@Module({
	imports: [DatabaseModule, CryptographyModule],
	controllers: [
		CreateAccountController,
		AuthenticateController,
		CreateQuestionController,
		FetchRecentQuestionsController,
		GetQuestionBySlugController,
		EditQuestionController,
	],
	providers: [
		CreateQuestionUseCase,
		FetchRecentQuestionsUseCase,
		AuthenticateStudentUseCase,
		RegisterStudentUseCase,
		GetQuestionBySlugUseCase,
		EditQuestionUseCase,
	],
})
export class HttpModule {}
