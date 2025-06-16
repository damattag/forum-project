import type { PaginationParams } from '@/core/repositories/pagination-params';
import type { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments.repository';
import type { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment.entity';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';
import { InMemoryStudentsRepository } from './in-memory-students.repository';

export class InMemoryQuestionCommentsRepository implements QuestionCommentsRepository {
	public items: QuestionComment[] = [];

	constructor(private readonly studentsRepository: InMemoryStudentsRepository) {}

	async create(questionComment: QuestionComment): Promise<void> {
		this.items.push(questionComment);
	}

	async findById(id: string): Promise<QuestionComment | null> {
		const questionComment = this.items.find(
			(questionComment) => questionComment.id.toString() === id,
		);

		if (!questionComment) {
			return null;
		}

		return questionComment;
	}

	async delete(questionComment: QuestionComment): Promise<void> {
		const questionCommentIndex = this.items.findIndex(
			(item) => item.id === questionComment.id,
		);

		if (questionCommentIndex === -1) {
			throw new Error('Question comment not found');
		}

		this.items.splice(questionCommentIndex, 1);
	}

	async listByQuestionId(
		questionId: string,
		params: PaginationParams,
	): Promise<QuestionComment[]> {
		const page = params.page ?? 1;
		const limit = params.limit ?? 20;

		const questionComments = this.items
			.filter((questionComment) => questionComment.questionId.toString() === questionId)
			.slice((page - 1) * limit, page * limit);

		return questionComments;
	}

	async listByQuestionIdWithAuthor(
		questionId: string,
		params: PaginationParams,
	): Promise<CommentWithAuthor[]> {
		const page = params.page ?? 1;
		const limit = params.limit ?? 20;

		const questionComments = this.items
			.filter((questionComment) => questionComment.questionId.toString() === questionId)
			.slice((page - 1) * limit, page * limit)
			.map((questionComment) => {
				const author = this.studentsRepository.items.find((author) =>
					author.id.equals(questionComment.authorId),
				);

				if (!author) {
					throw new Error(
						`Author with id ${questionComment.authorId.toString()} not found`,
					);
				}

				return CommentWithAuthor.create({
					commentId: questionComment.id,
					content: questionComment.content,
					authorId: questionComment.authorId,
					author: author.name,
					createdAt: questionComment.createdAt,
					updatedAt: questionComment.updatedAt,
				});
			});

		return questionComments;
	}
}
