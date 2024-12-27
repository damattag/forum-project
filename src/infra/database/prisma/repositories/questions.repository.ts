import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions.repository';
import type { Question } from '@/domain/forum/enterprise/entities/question.entity';
import { PrismaQuestionMapper } from '@/infra/database/prisma/mappers/question-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findById(id: string): Promise<Question | null> {
		const question = await this.prisma.question.findUnique({
			where: {
				id,
			},
		});

		if (!question) {
			return null;
		}

		return PrismaQuestionMapper.toDomain(question);
	}

	async create(question: Question): Promise<void> {
		const data = PrismaQuestionMapper.toPersistence(question);

		await this.prisma.question.create({
			data,
		});
	}

	async findBySlug(slug: string): Promise<Question | null> {
		const question = await this.prisma.question.findUnique({
			where: {
				slug,
			},
		});

		if (!question) {
			return null;
		}

		return PrismaQuestionMapper.toDomain(question);
	}

	async delete(question: Question): Promise<void> {
		await this.prisma.question.delete({
			where: {
				id: question.id.toString(),
			},
		});
	}

	async save(question: Question): Promise<void> {
		const data = PrismaQuestionMapper.toPersistence(question);

		await this.prisma.question.update({
			where: {
				id: question.id.toString(),
			},
			data,
		});
	}

	async listRecent({ page }: PaginationParams): Promise<Question[]> {
		const take = 10;

		const questions = await this.prisma.question.findMany({
			orderBy: {
				createdAt: 'desc',
			},
			take,
			skip: (page - 1) * take,
		});

		return questions.map(PrismaQuestionMapper.toDomain);
	}
}
