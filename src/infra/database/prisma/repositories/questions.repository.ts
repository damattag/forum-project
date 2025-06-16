import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments.repository';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions.repository';
import { Question } from '@/domain/forum/enterprise/entities/question.entity';
import { PrismaQuestionMapper } from '@/infra/database/prisma/mappers/question-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { getPagination } from '@/infra/database/utils/get_pagination';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
	constructor(
		private readonly prisma: PrismaService,
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
		]);
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
}
