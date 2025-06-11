import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment.usecase';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import {
	DeleteQuestionCommentParamsSchema,
	deleteQuestionCommentParamsValidationSchema,
} from '@/infra/http/dtos/delete-question-comment.dto';
import {
	BadRequestException,
	Controller,
	Delete,
	HttpCode,
	HttpStatus,
	Param,
} from '@nestjs/common';

@Controller('/questions/comments/id/:id')
export class DeleteQuestionCommentController {
	constructor(private readonly useCase: DeleteQuestionCommentUseCase) {}

	@Delete()
	@HttpCode(HttpStatus.NO_CONTENT)
	async handle(
		@CurrentUser() user: UserPayload,
		@Param(deleteQuestionCommentParamsValidationSchema)
		params: DeleteQuestionCommentParamsSchema,
	) {
		const { id: questionCommentId } = params;

		const result = await this.useCase.execute({
			questionCommentId,
			authorId: user.sub,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
