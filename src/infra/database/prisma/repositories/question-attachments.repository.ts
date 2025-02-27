import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments.repository';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment.entity';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { PrismaQuestionAttachmentMapper } from '../mappers/question-attachment-mapper';

@Injectable()
export class PrismaQuestionAttachmentsRepository
	implements QuestionAttachmentsRepository
{
	constructor(private readonly prisma: PrismaService) {}

	async listByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
		const questionAttachments = await this.prisma.attachment.findMany({
			where: {
				questionId,
			},
		});

		return questionAttachments.map(PrismaQuestionAttachmentMapper.toDomain);
	}

	async deleteListByQuestionId(questionId: string): Promise<void> {
		await this.prisma.attachment.deleteMany({
			where: {
				questionId,
			},
		});
	}
}
