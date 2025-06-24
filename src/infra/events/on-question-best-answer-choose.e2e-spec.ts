import { DomainEvents } from '@/core/events/domains-events';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AnswerFactory } from 'test/factories/make-answer';
import { QuestionFactory } from 'test/factories/make-question';
import { StudentFactory } from 'test/factories/make-student';
import { waitFor } from 'test/utils/wait-for';

describe('On Question Best Answer Chosen (E2E)', () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let studentFactory: StudentFactory;
	let answerFactory: AnswerFactory;
	let questionFactory: QuestionFactory;
	let jwt: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, AnswerFactory, QuestionFactory],
		}).compile();

		app = moduleRef.createNestApplication();
		prisma = moduleRef.get(PrismaService);
		studentFactory = moduleRef.get(StudentFactory);
		answerFactory = moduleRef.get(AnswerFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		jwt = moduleRef.get(JwtService);

		DomainEvents.shouldRun = true;

		await app.init();
	});

	it('should send a notification when a question has a best answer chosen', async () => {
		const user = await studentFactory.makePrismaStudent();

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const answer = await answerFactory.makePrismaAnswer({
			authorId: user.id,
			questionId: question.id,
		});

		const accessToken = jwt.sign({
			sub: user.id.toString(),
		});

		await request(app.getHttpServer())
			.patch(`/answers/${answer.id.toString()}/choose-as-best`)
			.set('Authorization', `Bearer ${accessToken}`);

		await waitFor(async () => {
			const notificationOnDatabase = await prisma.notification.findFirst({
				where: {
					recipientId: question.authorId.toString(),
				},
			});

			expect(notificationOnDatabase).toBeTruthy();
		});
	});
});
