import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
	Answer,
	type AnswerProps,
} from '@/domain/forum/enterprise/entities/answer.entity';
import { faker } from '@faker-js/faker';

export function makeAnswer(
	override: Partial<AnswerProps> = {},
	id?: UniqueEntityId,
): Answer {
	const answer = Answer.create(
		{
			authorId: new UniqueEntityId(),
			content: faker.lorem.text(),
			questionId: new UniqueEntityId(),
			...override,
		},
		id,
	);

	return answer;
}
