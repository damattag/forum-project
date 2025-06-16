import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Attachment } from '../attachment.entity';
import { Slug } from './slug';

export interface QuestionDetailsProps {
	questionId: UniqueEntityId;
	authorId: UniqueEntityId;
	author: string;
	title: string;
	slug: Slug;
	content: string;
	attachments: Attachment[];
	bestAnswerId?: UniqueEntityId | null;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class QuestionDetails {
	constructor(private readonly props: QuestionDetailsProps) {}

	get questionId() {
		return this.props.questionId;
	}

	get authorId() {
		return this.props.authorId;
	}

	get bestAnswerId() {
		return this.props.bestAnswerId;
	}

	get author() {
		return this.props.author;
	}

	get title() {
		return this.props.title;
	}

	get slug() {
		return this.props.slug;
	}

	get content() {
		return this.props.content;
	}

	get attachments() {
		return this.props.attachments;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	static create(props: QuestionDetailsProps) {
		return new QuestionDetails(props);
	}
}
