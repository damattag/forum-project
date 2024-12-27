import { type Either, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import type { AnswersRepository } from '@/domain/forum/application/repositories/answers.repository';
import { Answer } from '@/domain/forum/enterprise/entities/answer.entity';
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list.entity';
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment.entity';

interface AnswerQuestionUseCaseRequest {
	questionId: string;
	instructorId: string;
	content: string;
	attachmentsIds: string[];
}

type AnswerQuestionUseCaseResponse = Either<void, { answer: Answer }>;

export class AnswerQuestionUseCase {
	constructor(private answersRepository: AnswersRepository) {}
	async execute({
		instructorId,
		questionId,
		content,
		attachmentsIds,
	}: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
		const answer = Answer.create({
			authorId: new UniqueEntityId(instructorId),
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
