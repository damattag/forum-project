import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
	Answer,
	type AnswerProps,
} from '@/domain/forum/enterprise/entities/answer.entity';
import { PrismaAnswerMapper } from '@/infra/database/prisma/mappers/answer-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

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

@Injectable()
export class AnswerFactory {
	constructor(private readonly prisma: PrismaService) {}

	async makePrismaAnswer(data: Partial<AnswerProps> = {}): Promise<Answer> {
		const answer = makeAnswer(data);

		await this.prisma.answer.create({
			data: PrismaAnswerMapper.toPersistence(answer),
		});

		return answer;
	}
}
