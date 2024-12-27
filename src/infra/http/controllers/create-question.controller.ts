import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question.usecase';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import {
	CreateQuestionBodySchema,
	createQuestionBodyValidationSchema,
} from '@/infra/http/dtos/create-question.dto';
import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
} from '@nestjs/common';

@Controller('/questions')
export class CreateQuestionController {
	constructor(private readonly useCase: CreateQuestionUseCase) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async handle(
		@CurrentUser() user: UserPayload,
		@Body(createQuestionBodyValidationSchema) body: CreateQuestionBodySchema,
	) {
		const { title, content } = body;

		const result = await this.useCase.execute({
			title,
			content,
			authorId: user.sub,
			attachmentsIds: [],
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
