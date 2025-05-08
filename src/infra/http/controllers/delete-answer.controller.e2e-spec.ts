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

describe('Delete answer (E2E)', () => {
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

		await app.init();
	});

	test('[DELETE] /answers/id/:id', async () => {
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

		const response = await request(app.getHttpServer())
			.delete(`/answers/id/${answer.id.toString()}`)
			.set('Authorization', `Bearer ${accessToken}`);

		expect(response.status).toBe(204);

		const answerOnDatabase = await prisma.answer.findFirst({
			where: {
				id: answer.id.toString(),
			},
		});

		expect(answerOnDatabase).toBeNull();
	});

	test('[DELETE] /answers/id/:id - should not be able to delete another user answer', async () => {
		const user = await studentFactory.makePrismaStudent();
		const anotherUser = await studentFactory.makePrismaStudent();
		const question = await questionFactory.makePrismaQuestion({
			authorId: anotherUser.id,
		});

		const accessToken = jwt.sign({
			sub: user.id.toString(),
		});

		const answer = await answerFactory.makePrismaAnswer({
			authorId: anotherUser.id,
			questionId: question.id,
		});

		const response = await request(app.getHttpServer())
			.delete(`/answers/id/${answer.id.toString()}`)
			.set('Authorization', `Bearer ${accessToken}`);

		expect(response.status).toBe(400);

		const answerOnDatabase = await prisma.answer.findFirst({
			where: {
				id: answer.id.toString(),
			},
		});

		expect(answerOnDatabase).toBeTruthy();
	});
});
