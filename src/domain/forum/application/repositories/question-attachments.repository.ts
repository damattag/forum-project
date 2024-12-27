import type { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment.entity';

export interface QuestionAttachmentsRepository {
	listByQuestionId(questionId: string): Promise<QuestionAttachment[]>;
	deleteListByQuestionId(questionId: string): Promise<void>;
}
