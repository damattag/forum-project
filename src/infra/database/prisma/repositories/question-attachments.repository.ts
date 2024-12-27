import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments.repository';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment.entity';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaQuestionAttachmentsRepository
	implements QuestionAttachmentsRepository
{
	constructor(private readonly prisma: PrismaService) {}

	listByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
		throw new Error('Method not implemented.');
	}

	deleteListByQuestionId(questionId: string): Promise<void> {
		throw new Error('Method not implemented.');
	}
}
