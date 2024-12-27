import type { Notification } from '@/domain/notification/enterprise/entities/notification.entity';

export interface NotificationsRepository {
	create(notification: Notification): Promise<void>;
	findById(id: string): Promise<Notification | null>;
	save(notification: Notification): Promise<void>;
}
