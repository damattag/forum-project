import type { PaginationParams } from '@/core/repositories/pagination-params';
import type { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments.repository';
import type { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment.entity';

export class InMemoryQuestionCommentsRepository implements QuestionCommentsRepository {
	public items: QuestionComment[] = [];

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
		{ page }: PaginationParams,
	): Promise<QuestionComment[]> {
		const questionComments = this.items
			.filter((questionComment) => questionComment.questionId.toString() === questionId)
			.slice((page - 1) * 20, page * 20);

		return questionComments;
	}
}
