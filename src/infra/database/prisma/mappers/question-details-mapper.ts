import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import {
	Attachment as PrismaAttachment,
	Question as PrismaQuestion,
	User as PrismaUser,
} from '@prisma/client';
import { PrismaAttachmentMapper } from './attachment-mapper';

type PrismaQuestionDetails = PrismaQuestion & {
	author: PrismaUser;
	attachments: PrismaAttachment[];
};

export class PrismaQuestionDetailsMapper {
	static toDomain(raw: PrismaQuestionDetails): QuestionDetails {
		return QuestionDetails.create({
			questionId: new UniqueEntityId(raw.id),
			content: raw.content,
			authorId: new UniqueEntityId(raw.authorId),
			author: raw.author.name,
			title: raw.title,
			slug: Slug.create(raw.slug),
			attachments: raw.attachments.map((attachment) =>
				PrismaAttachmentMapper.toDomain(attachment),
			),
			bestAnswerId: raw.bestAnswerId ? new UniqueEntityId(raw.bestAnswerId) : null,
			createdAt: raw.createdAt,
			updatedAt: raw.updatedAt,
		});
	}
}
