import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers.usecase';
import {
	FetchQuestionAnswersParamsSchema,
	FetchQuestionAnswersQuerySchema,
	fetchQuestionAnswersParamsValidationSchema,
	fetchQuestionAnswersQueryValidationSchema,
} from '@/infra/http/dtos/fetch-question-answers.dto';
import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Query,
} from '@nestjs/common';
import { AnswerPresenter } from '../presenters/answer.presenter';

@Controller('/questions/:questionId/answers')
export class FetchQuestionAnswersController {
	constructor(private readonly useCase: FetchQuestionAnswersUseCase) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	async handle(
		@Param(fetchQuestionAnswersParamsValidationSchema)
		params: FetchQuestionAnswersParamsSchema,
		@Query(fetchQuestionAnswersQueryValidationSchema)
		query: FetchQuestionAnswersQuerySchema,
	) {
		const { questionId } = params;
		const { page, limit } = query;

		const result = await this.useCase.execute({
			questionId,
			page,
			limit,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}

		const { answers } = result.value;

		return { answers: answers.map(AnswerPresenter.toHttp) };
	}
}
