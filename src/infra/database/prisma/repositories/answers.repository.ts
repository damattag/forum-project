import type { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers.repository';
import type { Answer } from '@/domain/forum/enterprise/entities/answer.entity';
import { PrismaAnswerMapper } from '@/infra/database/prisma/mappers/answer-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { getPagination } from '@/infra/database/utils/get_pagination';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
	constructor(private readonly prisma: PrismaService) {}

	async listByQuestionId(
		questionId: string,
		params: PaginationParams,
	): Promise<Answer[]> {
		const { skip, take } = getPagination(params);

		const answers = await this.prisma.answer.findMany({
			where: {
				questionId,
			},
			orderBy: {
				createdAt: 'desc',
			},
			take,
			skip,
		});

		return answers.map(PrismaAnswerMapper.toDomain);
	}

	async findById(id: string): Promise<Answer | null> {
		const answer = await this.prisma.answer.findUnique({
			where: {
				id,
			},
		});

		if (!answer) {
			return null;
		}

		return PrismaAnswerMapper.toDomain(answer);
	}

	async create(answer: Answer): Promise<void> {
		const data = PrismaAnswerMapper.toPersistence(answer);

		await this.prisma.answer.create({
			data,
		});
	}

	async delete(answer: Answer): Promise<void> {
		await this.prisma.answer.delete({
			where: {
				id: answer.id.toString(),
			},
		});
	}

	async save(answer: Answer): Promise<void> {
		const data = PrismaAnswerMapper.toPersistence(answer);

		await this.prisma.answer.update({
			where: {
				id: answer.id.toString(),
			},
			data,
		});
	}

	async listRecent({ page, limit }: PaginationParams): Promise<Answer[]> {
		const { skip, take } = getPagination({ page, limit });

		const answers = await this.prisma.answer.findMany({
			orderBy: {
				createdAt: 'desc',
			},
			take,
			skip,
		});

		return answers.map(PrismaAnswerMapper.toDomain);
	}
}
