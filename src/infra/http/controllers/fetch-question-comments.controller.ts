import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments.usecase';
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
import { CommentWithAuthorPresenter } from '../presenters/comment-with-author.presenter';

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

		const { comments } = result.value;

		return { comments: comments.map(CommentWithAuthorPresenter.toHttp) };
	}
}
