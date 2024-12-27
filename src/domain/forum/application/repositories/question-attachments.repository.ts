import type { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment.entity';

export abstract class QuestionAttachmentsRepository {
	abstract listByQuestionId(questionId: string): Promise<QuestionAttachment[]>;
	abstract deleteListByQuestionId(questionId: string): Promise<void>;
}
