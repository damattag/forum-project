import { type Either, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions.repository';
import { QuestionAttachmentList } from '@/domain/forum/enterprise/entities/question-attachment-list.entity';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment.entity';
import { Question } from '@/domain/forum/enterprise/entities/question.entity';
import { Injectable } from '@nestjs/common';

interface CreateQuestionUseCaseRequest {
	authorId: string;
	title: string;
	content: string;
	attachmentsIds: string[];
}

type CreateQuestionUseCaseResponse = Either<void, { question: Question }>;

@Injectable()
export class CreateQuestionUseCase {
	constructor(private readonly questionsRepository: QuestionsRepository) {}

	async execute({
		authorId,
		content,
		title,
		attachmentsIds,
	}: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
		const question = Question.create({
			authorId: new UniqueEntityId(authorId),
			content,
			title,
		});

		const questionAttachments = attachmentsIds?.map((attachmentId) =>
			QuestionAttachment.create({
				attachmentId: new UniqueEntityId(attachmentId),
				questionId: question.id,
			}),
		);

		question.attachments = new QuestionAttachmentList(questionAttachments);

		await this.questionsRepository.create(question);

		return right({
			question,
		});
	}
}
