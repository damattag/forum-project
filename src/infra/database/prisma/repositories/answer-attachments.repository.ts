import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments.repository';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment.entity';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { PrismaAnswerAttachmentMapper } from '../mappers/answer-attachment-mapper';

@Injectable()
export class PrismaAnswerAttachmentsRepository implements AnswerAttachmentsRepository {
	constructor(private readonly prisma: PrismaService) {}

	async listByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
		const answerAttachments = await this.prisma.attachment.findMany({
			where: {
				answerId,
			},
		});

		return answerAttachments.map(PrismaAnswerAttachmentMapper.toDomain);
	}

	async deleteListByAnswerId(answerId: string): Promise<void> {
		await this.prisma.attachment.deleteMany({
			where: {
				answerId,
			},
		});
	}
}
