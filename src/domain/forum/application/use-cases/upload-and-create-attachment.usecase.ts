import { type Either, left, right } from '@/core/either';
import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments.repository';
import { Uploader } from '@/domain/forum/application/storage/uploader';
import { Attachment } from '@/domain/forum/enterprise/entities/attachment.entity';
import { Injectable } from '@nestjs/common';
import { InvalidAttachmentTypeException } from './exceptions/invalid-attachment-type.exception';

interface UploadAndCreateAttachmentUseCaseRequest {
	fileName: string;
	fileType: string;
	body: Buffer;
}

type UploadAndCreateAttachmentUseCaseResponse = Either<
	InvalidAttachmentTypeException,
	{ attachment: Attachment }
>;

@Injectable()
export class UploadAndCreateAttachmentUseCase {
	constructor(
		private readonly attachmentsRepository: AttachmentsRepository,
		private readonly uploader: Uploader,
	) {}

	async execute({
		fileName,
		fileType,
		body,
	}: UploadAndCreateAttachmentUseCaseRequest): Promise<UploadAndCreateAttachmentUseCaseResponse> {
		if (!/^(image\/(jpeg|png))$|^(application\/(pdf))$/.test(fileType)) {
			return left(new InvalidAttachmentTypeException(fileType));
		}

		const { url } = await this.uploader.upload({
			fileName,
			fileType,
			body,
		});

		const attachment = Attachment.create({
			title: fileName,
			url,
		});

		await this.attachmentsRepository.create(attachment);

		return right({ attachment });
	}
}
