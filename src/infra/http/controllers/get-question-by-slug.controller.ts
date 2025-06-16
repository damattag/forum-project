import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug.usecase';
import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
} from '@nestjs/common';
import {
	GetQuestionBySlugParamsSchema,
	getQuestionBySlugParamsValidationSchema,
} from '../dtos/get-question-by-slug.dto';
import { QuestionDetailsPresenter } from '../presenters/question-details.presenter';

@Controller('/questions/slug/:slug')
export class GetQuestionBySlugController {
	constructor(private readonly useCase: GetQuestionBySlugUseCase) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	async handle(
		@Param(getQuestionBySlugParamsValidationSchema)
		params: GetQuestionBySlugParamsSchema,
	) {
		const { slug } = params;

		const result = await this.useCase.execute({ slug });

		if (result.isLeft()) {
			throw new BadRequestException();
		}

		return { question: QuestionDetailsPresenter.toHttp(result.value.question) };
	}
}
