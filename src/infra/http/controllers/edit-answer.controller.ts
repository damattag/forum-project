import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer.usecase';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import {
	EditAnswerBodySchema,
	EditAnswerParamsSchema,
	editAnswerBodyValidationSchema,
	editAnswerParamsValidationSchema,
} from '@/infra/http/dtos/edit-answer.dto';
import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
} from '@nestjs/common';

@Controller('/answers/id/:id')
export class EditAnswerController {
	constructor(private readonly useCase: EditAnswerUseCase) {}

	@Patch()
	@HttpCode(HttpStatus.NO_CONTENT)
	async handle(
		@CurrentUser() user: UserPayload,
		@Body(editAnswerBodyValidationSchema) body: EditAnswerBodySchema,
		@Param(editAnswerParamsValidationSchema) params: EditAnswerParamsSchema,
	) {
		const { content, attachments } = body;
		const { id: answerId } = params;

		const result = await this.useCase.execute({
			content,
			answerId,
			authorId: user.sub,
			attachmentIds: attachments,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
