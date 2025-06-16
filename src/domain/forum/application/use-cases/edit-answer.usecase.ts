import { type Either, left, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedException } from '@/core/exceptions/exceptions/not-allowed.exception';
import { ResourceNotFoundException } from '@/core/exceptions/exceptions/resource-not-found.exception';
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments.repository';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers.repository';
import { AnswerAttachmentList } from '@/domain/forum/enterprise/entities/answer-attachment-list.entity';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment.entity';
import type { Answer } from '@/domain/forum/enterprise/entities/answer.entity';
import { Injectable } from '@nestjs/common';

interface EditAnswerUseCaseRequest {
	authorId: string;
	answerId: string;
	content?: string;
	attachmentIds?: string[];
}

type EditAnswerUseCaseResponse = Either<
	ResourceNotFoundException | NotAllowedException,
	{ answer: Answer }
>;

@Injectable()
export class EditAnswerUseCase {
	constructor(
		private answerAttachmentsRepository: AnswerAttachmentsRepository,
		private answersRepository: AnswersRepository,
	) {}
	async execute({
		content,
		authorId,
		answerId,
		attachmentIds,
	}: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
		const answer = await this.answersRepository.findById(answerId);

		if (!answer) {
			return left(new ResourceNotFoundException());
		}

		if (answer.authorId.toString() !== authorId) {
			return left(new NotAllowedException());
		}

		const currentAnswerAttachments =
			await this.answerAttachmentsRepository.listByAnswerId(answerId);

		const answerAttachmentsList = new AnswerAttachmentList(currentAnswerAttachments);

		const answerAttachments = attachmentIds?.map((attachmentId) => {
			return AnswerAttachment.create({
				attachmentId: new UniqueEntityId(attachmentId),
				answerId: answer.id,
			});
		});

		if (answerAttachments) {
			answerAttachmentsList.update(answerAttachments);
		}

		answer.content = content ?? answer.content;
		answer.attachments = answerAttachmentsList;

		await this.answersRepository.save(answer);

		return right({ answer });
	}
}
