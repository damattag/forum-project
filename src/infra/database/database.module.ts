import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments.repository';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments.repository';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers.repository';
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments.repository';
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments.repository';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions.repository';
import { StudentsRepository } from '@/domain/forum/application/repositories/students.repository';
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/answer-attachments.repository';
import { PrismaAnswerCommentsRepository } from './prisma/repositories/answer-comments.repository';
import { PrismaAnswersRepository } from './prisma/repositories/answers.repository';
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/question-attachments.repository';
import { PrismaQuestionCommentsRepository } from './prisma/repositories/question-comments.repository';
import { PrismaQuestionsRepository } from './prisma/repositories/questions.repository';
import { PrismaStudentsRepository } from './prisma/repositories/students.repository';

@Module({
	providers: [
		PrismaService,
		{
			provide: AnswerAttachmentsRepository,
			useClass: PrismaAnswerAttachmentsRepository,
		},
		{
			provide: AnswersRepository,
			useClass: PrismaAnswersRepository,
		},
		{
			provide: QuestionsRepository,
			useClass: PrismaQuestionsRepository,
		},
		{
			provide: QuestionAttachmentsRepository,
			useClass: PrismaQuestionAttachmentsRepository,
		},
		{
			provide: QuestionCommentsRepository,
			useClass: PrismaQuestionCommentsRepository,
		},
		{
			provide: AnswerCommentsRepository,
			useClass: PrismaAnswerCommentsRepository,
		},
		{
			provide: StudentsRepository,
			useClass: PrismaStudentsRepository,
		},
	],
	exports: [
		PrismaService,
		QuestionsRepository,
		AnswerAttachmentsRepository,
		AnswersRepository,
		QuestionAttachmentsRepository,
		QuestionCommentsRepository,
		AnswerCommentsRepository,
		StudentsRepository,
	],
})
export class DatabaseModule {}
