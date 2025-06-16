import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
	QuestionAttachment,
	type QuestionAttachmentProps,
} from '@/domain/forum/enterprise/entities/question-attachment.entity';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

export function makeQuestionAttachment(
	override: Partial<QuestionAttachmentProps> = {},
	id?: UniqueEntityId,
): QuestionAttachment {
	const questionAttachment = QuestionAttachment.create(
		{
			attachmentId: new UniqueEntityId(),
			questionId: new UniqueEntityId(),
			...override,
		},
		id,
	);

	return questionAttachment;
}

@Injectable()
export class QuestionAttachmentFactory {
	constructor(private readonly prisma: PrismaService) {}

	async makePrismaQuestionAttachment(override: Partial<QuestionAttachmentProps> = {}) {
		const questionAttachment = makeQuestionAttachment(override);

		await this.prisma.attachment.update({
			where: {
				id: questionAttachment.attachmentId.toString(),
			},
			data: {
				questionId: questionAttachment.questionId.toString(),
			},
		});

		return questionAttachment;
	}
}
