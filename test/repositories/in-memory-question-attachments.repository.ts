import type { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments.repository';
import type { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment.entity';

export class InMemoryQuestionAttachmentsRepository
	implements QuestionAttachmentsRepository
{
	public items: QuestionAttachment[] = [];

	async createMany(attachments: QuestionAttachment[]): Promise<void> {
		this.items.push(...attachments);
	}

	async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
		this.items = this.items.filter(
			(item) => !attachments.some((attachment) => attachment.equals(item)),
		);
	}

	async listByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
		return this.items.filter(
			(questionAttachment) => questionAttachment.questionId.toString() === questionId,
		);
	}

	async deleteListByQuestionId(questionId: string): Promise<void> {
		this.items = this.items.filter(
			(questionAttachment) => questionAttachment.questionId.toString() !== questionId,
		);
	}
}
