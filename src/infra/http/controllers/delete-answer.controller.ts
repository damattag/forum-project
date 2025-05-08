import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer.usecase';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import {
	DeleteAnswerParamsSchema,
	deleteAnswerParamsValidationSchema,
} from '@/infra/http/dtos/delete-answer.dto';
import {
	BadRequestException,
	Controller,
	Delete,
	HttpCode,
	HttpStatus,
	Param,
} from '@nestjs/common';

@Controller('/answers/id/:id')
export class DeleteAnswerController {
	constructor(private readonly useCase: DeleteAnswerUseCase) {}

	@Delete()
	@HttpCode(HttpStatus.NO_CONTENT)
	async handle(
		@CurrentUser() user: UserPayload,
		@Param(deleteAnswerParamsValidationSchema) params: DeleteAnswerParamsSchema,
	) {
		const { id: answerId } = params;

		const result = await this.useCase.execute({
			answerId,
			authorId: user.sub,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
