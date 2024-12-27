import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
	AnswerComment,
	type AnswerCommentProps,
} from '@/domain/forum/enterprise/entities/answer-comment.entity';
import { faker } from '@faker-js/faker';

export function makeAnswerComment(
	override: Partial<AnswerCommentProps> = {},
	id?: UniqueEntityId,
): AnswerComment {
	const answerComment = AnswerComment.create(
		{
			authorId: new UniqueEntityId(),
			content: faker.lorem.text(),
			answerId: new UniqueEntityId(),
			...override,
		},
		id,
	);

	return answerComment;
}
