import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Question } from '@/domain/forum/enterprise/entities/question.entity';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import { Prisma, Question as PrismaQuestion } from '@prisma/client';

export class PrismaQuestionMapper {
	static toDomain(question: PrismaQuestion): Question {
		return Question.create(
			{
				title: question.title,
				content: question.content,
				authorId: new UniqueEntityId(question.authorId),
				bestAnswerId: question.bestAnswerId
					? new UniqueEntityId(question.bestAnswerId)
					: null,
				slug: Slug.create(question.slug),
				createdAt: question.createdAt,
				updatedAt: question.updatedAt,
			},
			new UniqueEntityId(question.id),
		);
	}

	static toPersistence(question: Question): Prisma.QuestionUncheckedCreateInput {
		return {
			id: question.id.toString(),
			title: question.title,
			content: question.content,
			authorId: question.authorId.toString(),
			bestAnswerId: question.bestAnswerId?.toString(),
			slug: question.slug.value,
			createdAt: question.createdAt,
			updatedAt: question.updatedAt,
		};
	}
}
