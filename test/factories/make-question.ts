import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
	Question,
	type QuestionProps,
} from '@/domain/forum/enterprise/entities/question.entity';
import { PrismaQuestionMapper } from '@/infra/database/prisma/mappers/question-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

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

@Injectable()
export class QuestionFactory {
	constructor(private readonly prisma: PrismaService) {}

	async makePrismaQuestion(data: Partial<QuestionProps> = {}): Promise<Question> {
		const question = makeQuestion(data);

		await this.prisma.question.create({
			data: PrismaQuestionMapper.toPersistence(question),
		});

		return question;
	}
}
