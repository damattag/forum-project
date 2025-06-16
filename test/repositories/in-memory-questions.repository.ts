import { DomainEvents } from '@/core/events/domains-events';
import type { PaginationParams } from '@/core/repositories/pagination-params';
import type { QuestionsRepository } from '@/domain/forum/application/repositories/questions.repository';
import type { Question } from '@/domain/forum/enterprise/entities/question.entity';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';
import { InMemoryAttachmentsRepository } from './in-memory-attachments.repository';
import { InMemoryQuestionAttachmentsRepository } from './in-memory-question-attachments.repository';
import { InMemoryStudentsRepository } from './in-memory-students.repository';

export class InMemoryQuestionsRepository implements QuestionsRepository {
	public items: Question[] = [];

	constructor(
		private questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository,
		private attachmentsRepository: InMemoryAttachmentsRepository,
		private studentsRepository: InMemoryStudentsRepository,
	) {}

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

		this.questionAttachmentsRepository.deleteMany(question.attachments.getRemovedItems());
		this.questionAttachmentsRepository.createMany(question.attachments.getNewItems());

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

		this.questionAttachmentsRepository.createMany(question.attachments.getItems());

		DomainEvents.dispatchEventsForAggregate(question.id);
	}

	async listRecent({ page }: PaginationParams): Promise<Question[]> {
		const questions = this.items
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
			.slice((page - 1) * 20, page * 20);

		return questions;
	}

	async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
		const question = this.items.find((question) => question.slug.value === slug);

		if (!question) {
			return null;
		}

		const author = this.studentsRepository.items.find((student) =>
			student.id.equals(question.authorId),
		);

		if (!author) {
			throw new Error(`Author with id ${question.authorId.toString()} not found`);
		}

		const questionAttachments = this.questionAttachmentsRepository.items.filter(
			(questionAttachment) => questionAttachment.questionId.equals(question.id),
		);

		const attachments = questionAttachments.map((questionAttachment) => {
			const attachment = this.attachmentsRepository.items.find((attachment) =>
				attachment.id.equals(questionAttachment.attachmentId),
			);

			if (!attachment) {
				throw new Error(
					`Attachment with id ${questionAttachment.attachmentId.toString()} not found`,
				);
			}

			return attachment;
		});

		const questionDetails = QuestionDetails.create({
			questionId: question.id,
			authorId: question.authorId,
			author: author.name,
			title: question.title,
			slug: question.slug,
			content: question.content,
			attachments,
			createdAt: question.createdAt,
			updatedAt: question.updatedAt,
		});

		return questionDetails;
	}
}
