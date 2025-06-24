import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { NotificationFactory } from 'test/factories/make-notification';
import { QuestionFactory } from 'test/factories/make-question';
import { StudentFactory } from 'test/factories/make-student';

describe('Read notification (E2E)', () => {
	let app: INestApplication;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let notificationFactory: NotificationFactory;
	let prisma: PrismaService;
	let jwt: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, QuestionFactory, NotificationFactory],
		}).compile();

		app = moduleRef.createNestApplication();
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		notificationFactory = moduleRef.get(NotificationFactory);
		jwt = moduleRef.get(JwtService);
		prisma = moduleRef.get(PrismaService);
		await app.init();
	});

	test('[PATCH] /notifications/:id/read', async () => {
		const user = await studentFactory.makePrismaStudent({
			name: 'John Doe',
		});

		const accessToken = jwt.sign({
			sub: user.id.toString(),
		});

		const notification = await notificationFactory.makePrismaNotification({
			recipientId: user.id,
			title: 'New notification',
			content: 'New notification content',
		});

		const notificationId = notification.id.toString();

		const response = await request(app.getHttpServer())
			.patch(`/notifications/${notificationId}/read`)
			.set('Authorization', `Bearer ${accessToken}`);

		expect(response.status).toBe(204);

		const notificationOnDatabase = await prisma.notification.findUnique({
			where: {
				id: notificationId,
			},
		});

		expect(notificationOnDatabase?.readAt).not.toBeNull();
	});
});
