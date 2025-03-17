import { type Either, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers.repository';
import { AnswerAttachmentList } from '@/domain/forum/enterprise/entities/answer-attachment-list.entity';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment.entity';
import { Answer } from '@/domain/forum/enterprise/entities/answer.entity';
import { Injectable } from '@nestjs/common';

interface AnswerQuestionUseCaseRequest {
	questionId: string;
	authorId: string;
	content: string;
	attachmentsIds: string[];
}

type AnswerQuestionUseCaseResponse = Either<void, { answer: Answer }>;

@Injectable()
export class AnswerQuestionUseCase {
	constructor(private answersRepository: AnswersRepository) {}
	async execute({
		authorId,
		questionId,
		content,
		attachmentsIds,
	}: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
		const answer = Answer.create({
			authorId: new UniqueEntityId(authorId),
			questionId: new UniqueEntityId(questionId),
			content,
		});

		const answerAttachments = attachmentsIds?.map((attachmentId) =>
			AnswerAttachment.create({
				attachmentId: new UniqueEntityId(attachmentId),
				answerId: answer.id,
			}),
		);

		answer.attachments = new AnswerAttachmentList(answerAttachments);

		await this.answersRepository.create(answer);

		return right({ answer });
	}
}
