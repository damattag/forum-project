import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question.usecase';
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student.usecase';
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer.usecase';
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question.usecase';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question.usecase';
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer.usecase';
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment.usecase';
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question.usecase';
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer.usecase';
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question.usecase';
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments.usecase';
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers.usecase';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions.usecase';
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug.usecase';
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student.usecase';
import { CryptographyModule } from '@/infra/cryptography/cryptography.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { Module } from '@nestjs/common';
import { AnswerQuestionController } from './controllers/answer-question.controller';
import { AuthenticateController } from './controllers/authenticate.controller';
import { ChooseQuestionBestAnswerController } from './controllers/choose-question-best-answer.controller';
import { CommentOnQuestionController } from './controllers/comment-on-question.controller';
import { CreateAccountController } from './controllers/create-account.controller';
import { CreateQuestionController } from './controllers/create-question.controller';
import { DeleteAnswerController } from './controllers/delete-answer.controller';
import { DeleteQuestionCommentController } from './controllers/delete-question-comment.controller';
import { DeleteQuestionController } from './controllers/delete-question.controller';
import { EditAnswerController } from './controllers/edit-answer.controller';
import { EditQuestionController } from './controllers/edit-question.controller';
import { FetchAnswerCommentsController } from './controllers/fetch-answer-comments.controller';
import { FetchQuestionAnswersController } from './controllers/fetch-question-answers.controller';
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
		DeleteQuestionController,
		AnswerQuestionController,
		EditAnswerController,
		DeleteAnswerController,
		FetchAnswerCommentsController,
		FetchQuestionAnswersController,
		ChooseQuestionBestAnswerController,
		CommentOnQuestionController,
		DeleteQuestionCommentController,
	],
	providers: [
		CreateQuestionUseCase,
		FetchRecentQuestionsUseCase,
		AuthenticateStudentUseCase,
		RegisterStudentUseCase,
		GetQuestionBySlugUseCase,
		EditQuestionUseCase,
		DeleteQuestionUseCase,
		AnswerQuestionUseCase,
		EditAnswerUseCase,
		DeleteAnswerUseCase,
		FetchAnswerCommentsUseCase,
		FetchQuestionAnswersUseCase,
		ChooseQuestionBestAnswerUseCase,
		CommentOnQuestionUseCase,
		DeleteQuestionCommentUseCase,
	],
})
export class HttpModule {}
