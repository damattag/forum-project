import { DomainEvents } from '@/core/events/domains-events';
import type { PaginationParams } from '@/core/repositories/pagination-params';
import type { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments.repository';
import type { AnswersRepository } from '@/domain/forum/application/repositories/answers.repository';
import type { Answer } from '@/domain/forum/enterprise/entities/answer.entity';

export class InMemoryAnswersRepository implements AnswersRepository {
	public items: Answer[] = [];

	constructor(private answerAttachmentsRepository: AnswerAttachmentsRepository) {}

	async create(answer: Answer): Promise<void> {
		this.items.push(answer);

		DomainEvents.dispatchEventsForAggregate(answer.id);
	}

	async save(answer: Answer): Promise<void> {
		const answerIndex = this.items.findIndex((item) => item.id === answer.id);

		if (answerIndex === -1) {
			throw new Error('Answer not found');
		}

		this.items[answerIndex] = answer;

		DomainEvents.dispatchEventsForAggregate(answer.id);
	}

	async delete(answer: Answer): Promise<void> {
		const answerIndex = this.items.findIndex((item) => item.id === answer.id);

		if (answerIndex === -1) {
			throw new Error('Answer not found');
		}

		this.items.splice(answerIndex, 1);

		await this.answerAttachmentsRepository.deleteListByAnswerId(answer.id.toString());
	}

	async findById(id: string): Promise<Answer | null> {
		const answer = this.items.find((answer) => answer.id.toString() === id);

		if (!answer) {
			return null;
		}

		return answer;
	}

	async listByQuestionId(questionId: string, { page }: PaginationParams): Promise<Answer[]> {
		const answers = this.items
			.filter((answer) => answer.questionId.toString() === questionId)
			.slice((page - 1) * 20, page * 20);

		return answers;
	}
}
