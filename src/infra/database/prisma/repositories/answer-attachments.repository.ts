import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments.repository';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment.entity';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaAnswerAttachmentsRepository implements AnswerAttachmentsRepository {
	constructor(private readonly prisma: PrismaService) {}

	listByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
		throw new Error('Method not implemented.');
	}

	deleteListByAnswerId(answerId: string): Promise<void> {
		throw new Error('Method not implemented.');
	}
}
