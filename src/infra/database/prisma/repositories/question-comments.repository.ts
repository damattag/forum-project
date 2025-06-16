import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments.repository';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment.entity';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';
import { PrismaQuestionCommentMapper } from '@/infra/database/prisma/mappers/question-comment-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { getPagination } from '@/infra/database/utils/get_pagination';
import { Injectable } from '@nestjs/common';
import { PrismaCommentWithAuthorMapper } from '../mappers/comment-with-author-mapper';

@Injectable()
export class PrismaQuestionCommentsRepository implements QuestionCommentsRepository {
	constructor(private readonly prisma: PrismaService) {}

	async create(questionComment: QuestionComment): Promise<void> {
		const data = PrismaQuestionCommentMapper.toPersistence(questionComment);

		await this.prisma.comment.create({
			data,
		});
	}

	async findById(id: string): Promise<QuestionComment | null> {
		const questionComment = await this.prisma.comment.findUnique({
			where: {
				id,
			},
		});

		if (!questionComment) {
			return null;
		}

		return PrismaQuestionCommentMapper.toDomain(questionComment);
	}

	async delete(questionComment: QuestionComment): Promise<void> {
		await this.prisma.comment.delete({
			where: {
				id: questionComment.id.toString(),
			},
		});
	}

	async listByQuestionId(
		questionId: string,
		pagination: PaginationParams,
	): Promise<QuestionComment[]> {
		const { skip, take } = getPagination(pagination);

		const questionComments = await this.prisma.comment.findMany({
			where: {
				questionId,
			},
			orderBy: {
				createdAt: 'desc',
			},
			take,
			skip,
		});

		return questionComments.map(PrismaQuestionCommentMapper.toDomain);
	}

	async listByQuestionIdWithAuthor(
		questionId: string,
		params: PaginationParams,
	): Promise<CommentWithAuthor[]> {
		const { skip, take } = getPagination(params);

		const questionComments = await this.prisma.comment.findMany({
			where: {
				questionId,
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

		return questionComments.map(PrismaCommentWithAuthorMapper.toDomain);
	}
}
