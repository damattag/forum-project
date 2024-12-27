import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions.usecase';
import {
	FetchRecentQuestionsQueryParamsSchema,
	fetchRecentQuestionsQueryParamsValidationSchema,
} from '@/infra/http/dtos/fetch-recent-questions.dto';
import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('/questions')
@UseGuards(AuthGuard('jwt'))
export class FetchRecentQuestionsController {
	constructor(private readonly useCase: FetchRecentQuestionsUseCase) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	async handle(
		@Query(fetchRecentQuestionsQueryParamsValidationSchema)
		queryRaw: FetchRecentQuestionsQueryParamsSchema,
	) {
		const { page, limit } = queryRaw;

		const questions = await this.useCase.execute({ page, limit });

		return { questions };
	}
}
