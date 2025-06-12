import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments.repository';
import { Attachment } from '@/domain/forum/enterprise/entities/attachment.entity';
import { PrismaAttachmentMapper } from '@/infra/database/prisma/mappers/attachment-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaAttachmentsRepository implements AttachmentsRepository {
	constructor(private readonly prisma: PrismaService) {}

	async create(attachment: Attachment): Promise<void> {
		await this.prisma.attachment.create({
			data: PrismaAttachmentMapper.toPrisma(attachment),
		});
	}
}
