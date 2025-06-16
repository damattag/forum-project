import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments.repository';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment.entity';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { PrismaAnswerAttachmentMapper } from '../mappers/answer-attachment-mapper';

@Injectable()
export class PrismaAnswerAttachmentsRepository implements AnswerAttachmentsRepository {
	constructor(private readonly prisma: PrismaService) {}

	async createMany(attachments: AnswerAttachment[]): Promise<void> {
		if (attachments.length === 0) {
			return;
		}

		const data = PrismaAnswerAttachmentMapper.toPrismaUpdateMany(attachments);

		await this.prisma.attachment.updateMany(data);
	}

	async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
		if (attachments.length === 0) {
			return;
		}

		await this.prisma.attachment.deleteMany({
			where: {
				id: {
					in: attachments.map((attachment) => attachment.id.toString()),
				},
			},
		});
	}

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
