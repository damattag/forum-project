import { DomainEvents } from '@/core/events/domains-events';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments.repository';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions.repository';
import { Question } from '@/domain/forum/enterprise/entities/question.entity';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';
import { CacheRepository } from '@/infra/cache/cache.repository';
import { PrismaQuestionDetailsMapper } from '@/infra/database/prisma/mappers/question-details-mapper';
import { PrismaQuestionMapper } from '@/infra/database/prisma/mappers/question-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { getPagination } from '@/infra/database/utils/get_pagination';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
	constructor(
		private readonly prisma: PrismaService,
		private readonly cacheRepository: CacheRepository,
		private readonly questionAttachmentsRepository: QuestionAttachmentsRepository,
	) {}

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

		await this.questionAttachmentsRepository.createMany(question.attachments.getItems());

		DomainEvents.dispatchEventsForAggregate(question.id);
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
		const cacheKey = `questions:${question.slug}:details`;

		await Promise.all([
			this.prisma.question.update({
				where: {
					id: question.id.toString(),
				},
				data,
			}),
			this.questionAttachmentsRepository.deleteMany(
				question.attachments.getRemovedItems(),
			),
			this.questionAttachmentsRepository.createMany(question.attachments.getNewItems()),
			this.cacheRepository.delete(cacheKey),
		]);

		DomainEvents.dispatchEventsForAggregate(question.id);
	}

	async listRecent(pagination: PaginationParams): Promise<Question[]> {
		const { skip, take } = getPagination(pagination);

		const questions = await this.prisma.question.findMany({
			orderBy: {
				createdAt: 'desc',
			},
			take,
			skip,
		});

		return questions.map(PrismaQuestionMapper.toDomain);
	}

	async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
		const cacheKey = `questions:${slug}:details`;

		const cachedQuestion = await this.cacheRepository.get(cacheKey);

		if (cachedQuestion) {
			return JSON.parse(cachedQuestion);
		}

		const question = await this.prisma.question.findUnique({
			where: {
				slug,
			},
			include: {
				author: true,
				attachments: true,
			},
		});

		if (!question) {
			return null;
		}

		const questionDetails = PrismaQuestionDetailsMapper.toDomain(question);

		await this.cacheRepository.set(cacheKey, JSON.stringify(questionDetails));

		return questionDetails;
	}
}
