import type { PaginationParams } from '@/core/repositories/pagination-params';
import type { Answer } from '@/domain/forum/enterprise/entities/answer.entity';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaAnswersRepository {
	constructor(private readonly prisma: PrismaService) {}

	listByQuestionId(questionId: string, params: PaginationParams): Promise<Answer[]> {
		throw new Error('Method not implemented.');
	}

	save(answer: Answer): Promise<void> {
		throw new Error('Method not implemented.');
	}

	delete(answer: Answer): Promise<void> {
		throw new Error('Method not implemented.');
	}
}
