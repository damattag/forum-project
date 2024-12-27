import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions.usecase';
import {
	FetchRecentQuestionsQueryParamsSchema,
	fetchRecentQuestionsQueryParamsValidationSchema,
} from '@/infra/http/dtos/fetch-recent-questions.dto';
import { QuestionPresenter } from '@/infra/http/presenters/question.presenter';
import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Query,
} from '@nestjs/common';

@Controller('/questions')
export class FetchRecentQuestionsController {
	constructor(private readonly useCase: FetchRecentQuestionsUseCase) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	async handle(
		@Query(fetchRecentQuestionsQueryParamsValidationSchema)
		queryRaw: FetchRecentQuestionsQueryParamsSchema,
	) {
		const { page, limit } = queryRaw;

		const result = await this.useCase.execute({ page, limit });

		if (result.isLeft()) {
			throw new BadRequestException();
		}

		const { questions } = result.value;

		return { questions: questions.map(QuestionPresenter.toHttp) };
	}
}
