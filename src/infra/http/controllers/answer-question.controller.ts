import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question.usecase';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import {
	AnswerQuestionBodySchema,
	AnswerQuestionParamsSchema,
	answerQuestionBodyValidationSchema,
	answerQuestionParamsValidationSchema,
} from '@/infra/http/dtos/answer-question.dto';
import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Param,
	Post,
} from '@nestjs/common';

@Controller('/questions/question_id/:question_id/answers')
export class AnswerQuestionController {
	constructor(private readonly useCase: AnswerQuestionUseCase) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async handle(
		@CurrentUser() user: UserPayload,
		@Body(answerQuestionBodyValidationSchema) body: AnswerQuestionBodySchema,
		@Param(answerQuestionParamsValidationSchema) params: AnswerQuestionParamsSchema,
	) {
		const { content, attachments } = body;
		const { question_id: questionId } = params;

		const result = await this.useCase.execute({
			questionId,
			attachmentIds: attachments,
			authorId: user.sub,
			content,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
