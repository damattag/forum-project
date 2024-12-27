import { type Either, left, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedException } from '@/core/exceptions/exceptions/not-allowed.exception';
import { ResourceNotFoundException } from '@/core/exceptions/exceptions/resource-not-found.exception';
import type { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments.repository';
import type { QuestionsRepository } from '@/domain/forum/application/repositories/questions.repository';
import { QuestionAttachmentList } from '@/domain/forum/enterprise/entities/question-attachment-list.entity';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment.entity';
import type { Question } from '@/domain/forum/enterprise/entities/question.entity';

interface EditQuestionUseCaseRequest {
	authorId: string;
	questionId: string;
	title: string;
	content: string;
	attachmentsIds: string[];
}

type EditQuestionUseCaseResponse = Either<
	NotAllowedException | ResourceNotFoundException,
	{ question: Question }
>;

export class EditQuestionUseCase {
	constructor(
		private questionsRepository: QuestionsRepository,
		private questionAttachmentsRepository: QuestionAttachmentsRepository,
	) {}
	async execute({
		content,
		title,
		authorId,
		questionId,
		attachmentsIds,
	}: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
		const question = await this.questionsRepository.findById(questionId);

		if (!question) {
			return left(new ResourceNotFoundException());
		}

		if (question.authorId.toString() !== authorId) {
			return left(new NotAllowedException());
		}

		const currentQuestionAttachments =
			await this.questionAttachmentsRepository.listByQuestionId(questionId);

		const questionAttachmentsList = new QuestionAttachmentList(
			currentQuestionAttachments,
		);

		const questionAttachments = attachmentsIds?.map((attachmentId) => {
			return QuestionAttachment.create({
				attachmentId: new UniqueEntityId(attachmentId),
				questionId: question.id,
			});
		});

		questionAttachmentsList.update(questionAttachments);

		question.title = title;
		question.content = content;
		question.attachments = questionAttachmentsList;

		await this.questionsRepository.save(question);

		return right({ question });
	}
}
