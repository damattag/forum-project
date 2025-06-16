import { type Either, right } from '@/core/either';
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments.repository';
import { Injectable } from '@nestjs/common';
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author';

interface FetchQuestionCommentsUseCaseRequest {
	questionId: string;
	page: number;
	limit: number;
}

type FetchQuestionCommentsUseCaseResponse = Either<
	void,
	{ comments: CommentWithAuthor[] }
>;

@Injectable()
export class FetchQuestionCommentsUseCase {
	constructor(private questionCommentsRepository: QuestionCommentsRepository) {}
	async execute({
		questionId,
		page,
		limit,
	}: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
		const questionComments =
			await this.questionCommentsRepository.listByQuestionIdWithAuthor(questionId, {
				page,
				limit,
			});

		return right({
			comments: questionComments,
		});
	}
}
