import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
	AnswerAttachment,
	type AnswerAttachmentProps,
} from '@/domain/forum/enterprise/entities/answer-attachment.entity';

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
