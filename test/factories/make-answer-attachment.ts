import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
	AnswerAttachment,
	type AnswerAttachmentProps,
} from '@/domain/forum/enterprise/entities/answer-attachment.entity';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

export function makeAnswerAttachment(
	override: Partial<AnswerAttachmentProps> = {},
	id?: UniqueEntityId,
): AnswerAttachment {
	const answerAttachment = AnswerAttachment.create(
		{
			attachmentId: new UniqueEntityId(),
			answerId: new UniqueEntityId(),
			...override,
		},
		id,
	);

	return answerAttachment;
}

@Injectable()
export class AnswerAttachmentFactory {
	constructor(private readonly prisma: PrismaService) {}

	async makePrismaAnswerAttachment(
		override: Partial<AnswerAttachmentProps> = {},
	): Promise<AnswerAttachment> {
		const answerAttachment = makeAnswerAttachment(override);

		await this.prisma.attachment.update({
			where: {
				id: answerAttachment.attachmentId.toString(),
			},
			data: {
				answerId: answerAttachment.answerId.toString(),
			},
		});

		return answerAttachment;
	}
}
