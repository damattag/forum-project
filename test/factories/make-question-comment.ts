import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
	QuestionComment,
	type QuestionCommentProps,
} from '@/domain/forum/enterprise/entities/question-comment.entity';
import { PrismaQuestionCommentMapper } from '@/infra/database/prisma/mappers/question-comment-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeQuestionComment(
	override: Partial<QuestionCommentProps> = {},
	id?: UniqueEntityId,
): QuestionComment {
	const questionComment = QuestionComment.create(
		{
			authorId: new UniqueEntityId(),
			content: faker.lorem.text(),
			questionId: new UniqueEntityId(),
			...override,
		},
		id,
	);

	return questionComment;
}

@Injectable()
export class QuestionCommentFactory {
	constructor(private readonly prisma: PrismaService) {}

	async makePrismaQuestionComment(
		data: Partial<QuestionCommentProps> = {},
	): Promise<QuestionComment> {
		const questionComment = makeQuestionComment(data);

		await this.prisma.comment.create({
			data: PrismaQuestionCommentMapper.toPersistence(questionComment),
		});

		return questionComment;
	}
}
