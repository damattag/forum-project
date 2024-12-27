import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/answer-attachments.repository';
import { PrismaAnswerCommentsRepository } from './prisma/repositories/answer-comments.repository';
import { PrismaAnswersRepository } from './prisma/repositories/answers.repository';
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/question-attachments.repository';
import { PrismaQuestionCommentsRepository } from './prisma/repositories/question-comments.repository';
import { PrismaQuestionsRepository } from './prisma/repositories/questions.repository';

@Module({
	providers: [
		PrismaService,
		PrismaAnswerAttachmentsRepository,
		PrismaAnswersRepository,
		PrismaQuestionsRepository,
		PrismaQuestionAttachmentsRepository,
		PrismaQuestionCommentsRepository,
		PrismaAnswerCommentsRepository,
	],
	exports: [
		PrismaService,
		PrismaAnswerAttachmentsRepository,
		PrismaAnswersRepository,
		PrismaQuestionsRepository,
		PrismaQuestionAttachmentsRepository,
		PrismaQuestionCommentsRepository,
		PrismaAnswerCommentsRepository,
	],
})
export class DatabaseModule {}
