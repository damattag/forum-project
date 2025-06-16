import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question.usecase';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import {
	EditQuestionBodySchema,
	EditQuestionParamsSchema,
	editQuestionBodyValidationSchema,
	editQuestionParamsValidationSchema,
} from '@/infra/http/dtos/edit-question.dto';
import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
} from '@nestjs/common';

@Controller('/questions/id/:id')
export class EditQuestionController {
	constructor(private readonly useCase: EditQuestionUseCase) {}

	@Patch()
	@HttpCode(HttpStatus.NO_CONTENT)
	async handle(
		@CurrentUser() user: UserPayload,
		@Body(editQuestionBodyValidationSchema) body: EditQuestionBodySchema,
		@Param(editQuestionParamsValidationSchema) params: EditQuestionParamsSchema,
	) {
		const { title, content, attachments } = body;
		const { id: questionId } = params;

		const result = await this.useCase.execute({
			title,
			content,
			questionId,
			authorId: user.sub,
			attachmentsIds: attachments,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
