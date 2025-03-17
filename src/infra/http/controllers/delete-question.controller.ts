import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question.usecase';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import {
	DeleteQuestionParamsSchema,
	deleteQuestionParamsValidationSchema,
} from '@/infra/http/dtos/delete-question.dto';
import {
	BadRequestException,
	Controller,
	Delete,
	HttpCode,
	HttpStatus,
	Param,
} from '@nestjs/common';

@Controller('/questions/id/:id')
export class DeleteQuestionController {
	constructor(private readonly useCase: DeleteQuestionUseCase) {}

	@Delete()
	@HttpCode(HttpStatus.NO_CONTENT)
	async handle(
		@CurrentUser() user: UserPayload,
		@Param(deleteQuestionParamsValidationSchema) params: DeleteQuestionParamsSchema,
	) {
		const { id: questionId } = params;

		const result = await this.useCase.execute({
			authorId: user.sub,
			questionId,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
