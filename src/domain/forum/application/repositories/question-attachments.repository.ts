import type { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment.entity';

export abstract class QuestionAttachmentsRepository {
	abstract createMany(attachments: QuestionAttachment[]): Promise<void>;
	abstract deleteMany(attachments: QuestionAttachment[]): Promise<void>;
	abstract listByQuestionId(questionId: string): Promise<QuestionAttachment[]>;
	abstract deleteListByQuestionId(questionId: string): Promise<void>;
}
