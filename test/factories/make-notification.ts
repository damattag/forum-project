import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
	Notification,
	type NotificationProps,
} from '@/domain/notification/enterprise/entities/notification.entity';
import { faker } from '@faker-js/faker';

export function makeNotification(
	override: Partial<NotificationProps> = {},
	id?: UniqueEntityId,
): Notification {
	const notification = Notification.create(
		{
			recipientId: new UniqueEntityId(),
			content: faker.lorem.text(),
			title: faker.lorem.sentence(),
			...override,
		},
		id,
	);

	return notification;
}
