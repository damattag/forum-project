import type { Attachment } from '@/domain/forum/enterprise/entities/attachment.entity';

export abstract class AttachmentsRepository {
	abstract create(attachment: Attachment): Promise<void>;
}
