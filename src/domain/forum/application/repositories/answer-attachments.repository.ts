import type { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment.entity';

export interface AnswerAttachmentsRepository {
	listByAnswerId(answerId: string): Promise<AnswerAttachment[]>;
	deleteListByAnswerId(answerId: string): Promise<void>;
}
