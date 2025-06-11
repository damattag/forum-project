import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer.usecase';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import {
	CommentOnAnswerBodySchema,
	CommentOnAnswerParamsSchema,
	commentOnAnswerBodyValidationSchema,
	commentOnAnswerParamsValidationSchema,
} from '@/infra/http/dtos/comment-on-answer.dto';
import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Param,
	Post,
} from '@nestjs/common';

@Controller('/answers/answer_id/:answer_id/comments')
export class CommentOnAnswerController {
	constructor(private readonly useCase: CommentOnAnswerUseCase) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async handle(
		@CurrentUser() user: UserPayload,
		@Body(commentOnAnswerBodyValidationSchema) body: CommentOnAnswerBodySchema,
		@Param(commentOnAnswerParamsValidationSchema) params: CommentOnAnswerParamsSchema,
	) {
		const { content } = body;
		const { answer_id: answerId } = params;

		const result = await this.useCase.execute({
			answerId,
			authorId: user.sub,
			content,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
