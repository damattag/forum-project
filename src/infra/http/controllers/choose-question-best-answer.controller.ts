import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer.usecase';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import {
	BadRequestException,
	Controller,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
} from '@nestjs/common';
import {
	ChooseQuestionBestAnswerParamsSchema,
	chooseQuestionBestAnswerParamsValidationSchema,
} from '../dtos/choose question-best-answer.dto';

@Controller('/answers/:answer_id/choose-as-best')
export class ChooseQuestionBestAnswerController {
	constructor(private readonly useCase: ChooseQuestionBestAnswerUseCase) {}

	@Patch()
	@HttpCode(HttpStatus.NO_CONTENT)
	async handle(
		@CurrentUser() user: UserPayload,
		@Param(chooseQuestionBestAnswerParamsValidationSchema)
		params: ChooseQuestionBestAnswerParamsSchema,
	) {
		const { answer_id: answerId } = params;

		const result = await this.useCase.execute({
			authorId: user.sub,
			answerId,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
