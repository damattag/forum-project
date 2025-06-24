import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Notification } from '@/domain/notification/enterprise/entities/notification.entity';
import { Prisma, Notification as PrismaNotification } from '@prisma/client';

export class PrismaNotificationMapper {
	static toDomain(notification: PrismaNotification): Notification {
		return Notification.create(
			{
				title: notification.title,
				content: notification.content,
				recipientId: new UniqueEntityId(notification.recipientId),
				createdAt: notification.createdAt,
				readAt: notification.readAt,
			},
			new UniqueEntityId(notification.id),
		);
	}

	static toPrisma(notification: Notification): Prisma.NotificationUncheckedCreateInput {
		return {
			id: notification.id.toString(),
			title: notification.title,
			content: notification.content,
			recipientId: notification.recipientId.toString(),
			readAt: notification.readAt,
			createdAt: notification.createdAt,
		};
	}
}
