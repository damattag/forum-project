import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments.repository';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment.entity';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';
import { PrismaAnswerCommentMapper } from '@/infra/database/prisma/mappers/answer-comment-mapper';
import { PrismaCommentWithAuthorMapper } from '@/infra/database/prisma/mappers/comment-with-author-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { getPagination } from '@/infra/database/utils/get_pagination';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaAnswerCommentsRepository implements AnswerCommentsRepository {
	constructor(private readonly prisma: PrismaService) {}

	async create(answerComment: AnswerComment): Promise<void> {
		const data = PrismaAnswerCommentMapper.toPersistence(answerComment);

		await this.prisma.comment.create({
			data,
		});
	}

	async findById(id: string): Promise<AnswerComment | null> {
		const answerComment = await this.prisma.comment.findUnique({
			where: {
				id,
			},
		});

		if (!answerComment) {
			return null;
		}

		return PrismaAnswerCommentMapper.toDomain(answerComment);
	}

	async delete(answerComment: AnswerComment): Promise<void> {
		await this.prisma.comment.delete({
			where: {
				id: answerComment.id.toString(),
			},
		});
	}

	async listByAnswerId(
		answerId: string,
		pagination: PaginationParams,
	): Promise<AnswerComment[]> {
		const { skip, take } = getPagination(pagination);

		const answerComments = await this.prisma.comment.findMany({
			where: {
				answerId,
			},
			orderBy: {
				createdAt: 'desc',
			},
			take,
			skip,
		});

		return answerComments.map(PrismaAnswerCommentMapper.toDomain);
	}

	async listByAnswerIdWithAuthor(
		answerId: string,
		params: PaginationParams,
	): Promise<CommentWithAuthor[]> {
		const { skip, take } = getPagination(params);

		const answerComments = await this.prisma.comment.findMany({
			where: {
				answerId,
			},
			orderBy: {
				createdAt: 'desc',
			},
			include: {
				author: true,
			},
			take,
			skip,
		});

		return answerComments.map(PrismaCommentWithAuthorMapper.toDomain);
	}
}
