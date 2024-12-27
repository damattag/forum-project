import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
	Question,
	type QuestionProps,
} from '@/domain/forum/enterprise/entities/question.entity';
import { faker } from '@faker-js/faker';

export function makeQuestion(
	override: Partial<QuestionProps> = {},
	id?: UniqueEntityId,
): Question {
	const question = Question.create(
		{
			authorId: new UniqueEntityId(),
			content: faker.lorem.text(),
			title: faker.lorem.sentence(),
			...override,
		},
		id,
	);

	return question;
}
