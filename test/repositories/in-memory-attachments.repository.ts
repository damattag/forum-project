import type { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments.repository';
import type { Attachment } from '@/domain/forum/enterprise/entities/attachment.entity';

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
	public items: Attachment[] = [];

	async create(attachment: Attachment): Promise<void> {
		this.items.push(attachment);
	}
}
