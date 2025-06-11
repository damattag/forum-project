import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment.usecase';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import {
	DeleteAnswerCommentParamsSchema,
	deleteAnswerCommentParamsValidationSchema,
} from '@/infra/http/dtos/delete-answer-comment.dto';
import {
	BadRequestException,
	Controller,
	Delete,
	HttpCode,
	HttpStatus,
	Param,
} from '@nestjs/common';

@Controller('/answers/comments/id/:id')
export class DeleteAnswerCommentController {
	constructor(private readonly useCase: DeleteAnswerCommentUseCase) {}

	@Delete()
	@HttpCode(HttpStatus.NO_CONTENT)
	async handle(
		@CurrentUser() user: UserPayload,
		@Param(deleteAnswerCommentParamsValidationSchema)
		params: DeleteAnswerCommentParamsSchema,
	) {
		const { id: answerCommentId } = params;

		const result = await this.useCase.execute({
			answerCommentId,
			authorId: user.sub,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
