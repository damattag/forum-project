import type { PaginationParams } from '@/core/repositories/pagination-params';
import type { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments.repository';
import type { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment.entity';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';
import { InMemoryStudentsRepository } from './in-memory-students.repository';

export class InMemoryAnswerCommentsRepository implements AnswerCommentsRepository {
	public items: AnswerComment[] = [];

	constructor(private studentsRepository: InMemoryStudentsRepository) {}

	async create(answerComment: AnswerComment): Promise<void> {
		this.items.push(answerComment);
	}

	async delete(answerComment: AnswerComment): Promise<void> {
		const answerCommentIndex = this.items.findIndex(
			(item) => item.id === answerComment.id,
		);

		if (answerCommentIndex === -1) {
			throw new Error('Answer comment not found');
		}

		this.items.splice(answerCommentIndex, 1);
	}

	async findById(id: string): Promise<AnswerComment | null> {
		return this.items.find((item) => item.id.toString() === id) ?? null;
	}

	async listByAnswerId(
		answerId: string,
		params: PaginationParams,
	): Promise<AnswerComment[]> {
		return this.items
			.filter((answerComment) => answerComment.answerId.toString() === answerId)
			.slice((params.page - 1) * 20, params.page * 20);
	}

	async listByAnswerIdWithAuthor(
		answerId: string,
		params: PaginationParams,
	): Promise<CommentWithAuthor[]> {
		const { page, limit } = params;

		const items = this.items
			.filter((answerComment) => answerComment.answerId.toString() === answerId)
			.slice((page - 1) * limit, page * limit)
			.map((item) => {
				const author = this.studentsRepository.items.find((student) =>
					student.id.equals(item.authorId),
				);

				if (!author) {
					throw new Error(`Author with id ${item.authorId.toString()} not found`);
				}

				return CommentWithAuthor.create({
					commentId: item.id,
					content: item.content,
					authorId: item.authorId,
					author: author.name,
					createdAt: item.createdAt,
					updatedAt: item.updatedAt,
				});
			});

		return items;
	}
}
