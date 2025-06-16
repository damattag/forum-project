import type { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments.repository';
import type { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment.entity';

export class InMemoryAnswerAttachmentsRepository implements AnswerAttachmentsRepository {
	public items: AnswerAttachment[] = [];

	async listByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
		return this.items.filter(
			(answerAttachment) => answerAttachment.answerId.toString() === answerId,
		);
	}

	async createMany(attachments: AnswerAttachment[]): Promise<void> {
		this.items.push(...attachments);
	}

	async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
		this.items = this.items.filter(
			(item) => !attachments.some((attachment) => attachment.equals(item)),
		);
	}

	async deleteListByAnswerId(answerId: string): Promise<void> {
		this.items = this.items.filter(
			(answerAttachment) => answerAttachment.answerId.toString() !== answerId,
		);
	}
}
