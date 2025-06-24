import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
	Notification,
	type NotificationProps,
} from '@/domain/notification/enterprise/entities/notification.entity';
import { PrismaNotificationMapper } from '@/infra/database/prisma/mappers/notification-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

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

@Injectable()
export class NotificationFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaNotification(
		override: Partial<NotificationProps> = {},
	): Promise<Notification> {
		const notification = makeNotification(override);

		await this.prisma.notification.create({
			data: PrismaNotificationMapper.toPrisma(notification),
		});

		return notification;
	}
}
