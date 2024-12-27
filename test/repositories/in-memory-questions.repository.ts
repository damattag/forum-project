import { DomainEvents } from '@/core/events/domains-events';
import type { PaginationParams } from '@/core/repositories/pagination-params';
import type { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments.repository';
import type { QuestionsRepository } from '@/domain/forum/application/repositories/questions.repository';
import type { Question } from '@/domain/forum/enterprise/entities/question.entity';

export class InMemoryQuestionsRepository implements QuestionsRepository {
	public items: Question[] = [];

	constructor(private questionAttachmentsRepository: QuestionAttachmentsRepository) {}

	async findById(id: string): Promise<Question | null> {
		const question = this.items.find((question) => question.id.toString() === id);

		if (!question) {
			return null;
		}

		return question;
	}

	async save(question: Question): Promise<void> {
		const questionIndex = this.items.findIndex(
			(item) => item.id.toString() === question.id.toString(),
		);

		if (questionIndex === -1) {
			throw new Error('Question not found');
		}

		this.items[questionIndex] = question;

		DomainEvents.dispatchEventsForAggregate(question.id);
	}

	async delete(question: Question): Promise<void> {
		const questionIndex = this.items.findIndex(
			(item) => item.id.toString() === question.id.toString(),
		);

		if (questionIndex === -1) {
			throw new Error('Question not found');
		}

		this.items.splice(questionIndex, 1);
		this.questionAttachmentsRepository.deleteListByQuestionId(question.id.toString());
	}

	async findBySlug(slug: string): Promise<Question | null> {
		const question = this.items.find((question) => question.slug.value === slug);

		if (!question) {
			return null;
		}

		return question;
	}

	async create(question: Question): Promise<void> {
		this.items.push(question);

		DomainEvents.dispatchEventsForAggregate(question.id);
	}

	async listRecent({ page }: PaginationParams): Promise<Question[]> {
		const questions = this.items
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
			.slice((page - 1) * 20, page * 20);

		return questions;
	}
}
