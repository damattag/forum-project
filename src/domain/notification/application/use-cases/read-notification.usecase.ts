import { type Either, left, right } from '@/core/either';
import { NotAllowedException } from '@/core/exceptions/exceptions/not-allowed.exception';
import { ResourceNotFoundException } from '@/core/exceptions/exceptions/resource-not-found.exception';
import type { Notification } from '@/domain/notification/enterprise/entities/notification.entity';
import type { NotificationsRepository } from '../repositories/notification.repository';

interface ReadNotificationUseCaseRequest {
	notificationId: string;
	recipientId: string;
}

type ReadNotificationUseCaseResponse = Either<
	NotAllowedException | ResourceNotFoundException,
	{ notification: Notification }
>;

export class ReadNotificationUseCase {
	constructor(private notificationsRepository: NotificationsRepository) {}
	async execute({
		recipientId,
		notificationId,
	}: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
		const notification = await this.notificationsRepository.findById(notificationId);

		if (!notification) {
			return left(new ResourceNotFoundException());
		}

		if (notification.recipientId.toString() !== recipientId) {
			return left(new NotAllowedException());
		}

		notification.read();

		await this.notificationsRepository.save(notification);

		return right({
			notification,
		});
	}
}
