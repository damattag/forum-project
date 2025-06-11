import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments.usecase';
import { CommentPresenter } from '@/infra/http/presenters/comment.presenter';
import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Query,
} from '@nestjs/common';
import {
	FetchQuestionCommentsParamsSchema,
	FetchQuestionCommentsQuerySchema,
	fetchQuestionCommentsParamsValidationSchema,
	fetchQuestionCommentsQueryValidationSchema,
} from '../dtos/fetch-question-comments.dto';

@Controller('/questions/:questionId/comments')
export class FetchQuestionCommentsController {
	constructor(private readonly useCase: FetchQuestionCommentsUseCase) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	async handle(
		@Param(fetchQuestionCommentsParamsValidationSchema)
		params: FetchQuestionCommentsParamsSchema,
		@Query(fetchQuestionCommentsQueryValidationSchema)
		query: FetchQuestionCommentsQuerySchema,
	) {
		const { questionId } = params;
		const { page = 1, limit = 10 } = query;

		const result = await this.useCase.execute({
			questionId,
			page,
			limit,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}

		const { questionComments } = result.value;

		return { comments: questionComments.map(CommentPresenter.toHttp) };
	}
}
