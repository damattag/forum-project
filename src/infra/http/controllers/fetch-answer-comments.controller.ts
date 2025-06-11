import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments.usecase';
import {
	FetchAnswerCommentsParamsSchema,
	FetchAnswerCommentsQuerySchema,
	fetchAnswerCommentsParamsValidationSchema,
	fetchAnswerCommentsQueryValidationSchema,
} from '@/infra/http/dtos/fetch-answer-comments.dto';
import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Query,
} from '@nestjs/common';
import { CommentPresenter } from '../presenters/comment.presenter';

@Controller('/answers/:answer_id/comments')
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
		const { answer_id: answerId } = params;
		const { page = 1, limit = 10 } = query;

		const result = await this.useCase.execute({
			answerId,
			page,
			limit,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}

		const { answerComments } = result.value;

		return {
			comments: answerComments.map(CommentPresenter.toHttp),
		};
	}
}
