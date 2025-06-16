import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';

export class QuestionDetailsPresenter {
	static toHttp(question: QuestionDetails) {
		return {
			id: question.questionId.toString(),
			authorId: question.authorId.toString(),
			author: question.author,
			title: question.title,
			slug: question.slug.value,
			content: question.content,
			bestAnswerId: question.bestAnswerId?.toString(),
			attachments: question.attachments.map((attachment) => ({
				id: attachment.id.toString(),
				title: attachment.title,
				url: attachment.url,
			})),
			createdAt: question.createdAt,
			updatedAt: question.updatedAt,
		};
	}
}
