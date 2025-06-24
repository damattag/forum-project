import { DomainEvents } from '@/core/events/domains-events';
import type { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments.repository';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers.repository';
import type { Answer } from '@/domain/forum/enterprise/entities/answer.entity';
import { PrismaAnswerMapper } from '@/infra/database/prisma/mappers/answer-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { getPagination } from '@/infra/database/utils/get_pagination';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
	constructor(
		private readonly prisma: PrismaService,
		private readonly answerAttachmentsRepository: AnswerAttachmentsRepository,
	) {}

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

		await this.answerAttachmentsRepository.createMany(answer.attachments.getItems());

		DomainEvents.dispatchEventsForAggregate(answer.id);
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

		await Promise.all([
			this.prisma.answer.update({
				where: {
					id: answer.id.toString(),
				},
				data,
			}),
			this.answerAttachmentsRepository.deleteMany(answer.attachments.getRemovedItems()),
			this.answerAttachmentsRepository.createMany(answer.attachments.getNewItems()),
		]);

		DomainEvents.dispatchEventsForAggregate(answer.id);
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
