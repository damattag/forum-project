import type { NotificationsRepository } from '@/domain/notification/application/repositories/notification.repository';
import type { Notification } from '@/domain/notification/enterprise/entities/notification.entity';

export class InMemoryNotificationsRepository implements NotificationsRepository {
	public items: Notification[] = [];

	async create(notification: Notification): Promise<void> {
		this.items.push(notification);
	}

	async findById(id: string): Promise<Notification | null> {
		const notification = this.items.find(
			(notification) => notification.id.toString() === id,
		);

		if (!notification) {
			return null;
		}

		return notification;
	}

	async save(notification: Notification): Promise<void> {
		const notificationIndex = this.items.findIndex(
			(item) => item.id.toString() === notification.id.toString(),
		);

		if (notificationIndex === -1) {
			throw new Error('Notification not found');
		}

		this.items[notificationIndex] = notification;
	}
}
