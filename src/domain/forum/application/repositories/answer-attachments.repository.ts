import type { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment.entity';

export abstract class AnswerAttachmentsRepository {
	abstract listByAnswerId(answerId: string): Promise<AnswerAttachment[]>;
	abstract deleteListByAnswerId(answerId: string): Promise<void>;
}
