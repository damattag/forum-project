import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments.repository';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment.entity';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaAnswerCommentsRepository implements AnswerCommentsRepository {
	constructor(private readonly prisma: PrismaService) {}

	create(answerComment: AnswerComment): Promise<void> {
		throw new Error('Method not implemented.');
	}

	delete(answerComment: AnswerComment): Promise<void> {
		throw new Error('Method not implemented.');
	}

	findById(id: string): Promise<AnswerComment | null> {
		throw new Error('Method not implemented.');
	}

	listByAnswerId(answerId: string, params: PaginationParams): Promise<AnswerComment[]> {
		throw new Error('Method not implemented.');
	}
}
