import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments.usecase';
import {
	FetchAnswerCommentsParamsSchema,
	FetchAnswerCommentsQuerySchema,
	fetchAnswerCommentsParamsValidationSchema,
	fetchAnswerCommentsQueryValidationSchema,
} from '@/infra/http/dtos/fetch-answer-comments.dto';
import { CommentWithAuthorPresenter } from '@/infra/http/presenters/comment-with-author.presenter';
import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Query,
} from '@nestjs/common';

@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
	constructor(private readonly useCase: FetchAnswerCommentsUseCase) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	async handle(
		@Param(fetchAnswerCommentsParamsValidationSchema)
		params: FetchAnswerCommentsParamsSchema,
		@Query(fetchAnswerCommentsQueryValidationSchema)
		query: FetchAnswerCommentsQuerySchema,
	) {
		const { answerId } = params;
		const { page = 1, limit = 10 } = query;

		const result = await this.useCase.execute({
			answerId,
			page,
			limit,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}

		const { comments } = result.value;

		return {
			comments: comments.map(CommentWithAuthorPresenter.toHttp),
		};
	}
}
