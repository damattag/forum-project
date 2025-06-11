import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question.usecase';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import {
	CommentOnQuestionBodySchema,
	CommentOnQuestionParamsSchema,
	commentOnQuestionBodyValidationSchema,
	commentOnQuestionParamsValidationSchema,
} from '@/infra/http/dtos/comment-on-question.dto';
import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Param,
	Post,
} from '@nestjs/common';

@Controller('/questions/question_id/:question_id/comments')
export class CommentOnQuestionController {
	constructor(private readonly useCase: CommentOnQuestionUseCase) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async handle(
		@CurrentUser() user: UserPayload,
		@Body(commentOnQuestionBodyValidationSchema) body: CommentOnQuestionBodySchema,
		@Param(commentOnQuestionParamsValidationSchema) params: CommentOnQuestionParamsSchema,
	) {
		const { content } = body;
		const { question_id: questionId } = params;

		const result = await this.useCase.execute({
			questionId,
			authorId: user.sub,
			content,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
