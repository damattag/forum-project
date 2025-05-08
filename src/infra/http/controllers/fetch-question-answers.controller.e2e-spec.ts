import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AnswerFactory } from 'test/factories/make-answer';
import { QuestionFactory } from 'test/factories/make-question';
import { StudentFactory } from 'test/factories/make-student';

describe('Fetch question answers (E2E)', () => {
	let app: INestApplication;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let answerFactory: AnswerFactory;
	let jwt: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, QuestionFactory, AnswerFactory],
		}).compile();

		app = moduleRef.createNestApplication();
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		answerFactory = moduleRef.get(AnswerFactory);
		jwt = moduleRef.get(JwtService);

		await app.init();
	});

	test('[GET] /questions/:questionId/answers', async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({
			sub: user.id.toString(),
		});

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		await Promise.all([
			answerFactory.makePrismaAnswer({
				questionId: question.id,
				authorId: user.id,
				content: 'Answer 1',
			}),
			answerFactory.makePrismaAnswer({
				questionId: question.id,
				authorId: user.id,
				content: 'Answer 2',
			}),
		]);

		const response = await request(app.getHttpServer())
			.get(`/questions/${question.id.toString()}/answers`)
			.set('Authorization', `Bearer ${accessToken}`)
			.query({
				page: 1,
				limit: 10,
			});

		expect(response.status).toBe(200);
		expect(response.body.answers).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					content: 'Answer 2',
				}),
				expect.objectContaining({
					content: 'Answer 1',
				}),
			]),
		);
	});

	test('[GET] /questions/:questionId/answers - should validate pagination params', async () => {
		const user = await studentFactory.makePrismaStudent();
		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const accessToken = jwt.sign({
			sub: user.id.toString(),
		});

		const response = await request(app.getHttpServer())
			.get(`/questions/${question.id.toString()}/answers`)
			.set('Authorization', `Bearer ${accessToken}`)
			.query({
				page: 'invalid',
				limit: 0,
			});

		expect(response.status).toBe(400);
	});

	test('[GET] /questions/:questionId/answers - should return empty array when no answers', async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({
			sub: user.id.toString(),
		});

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const response = await request(app.getHttpServer())
			.get(`/questions/${question.id.toString()}/answers`)
			.set('Authorization', `Bearer ${accessToken}`)
			.query({
				page: 1,
				limit: 10,
			});

		expect(response.status).toBe(200);
		expect(response.body).toEqual({
			answers: [],
		});
	});
});
