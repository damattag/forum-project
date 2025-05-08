import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AnswerFactory } from 'test/factories/make-answer';
import { AnswerCommentFactory } from 'test/factories/make-answer-comment';
import { QuestionFactory } from 'test/factories/make-question';
import { StudentFactory } from 'test/factories/make-student';

describe('Fetch answer comments (E2E)', () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let studentFactory: StudentFactory;
	let answerFactory: AnswerFactory;
	let answerCommentFactory: AnswerCommentFactory;
	let questionFactory: QuestionFactory;
	let jwt: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, AnswerFactory, AnswerCommentFactory, QuestionFactory],
		}).compile();

		app = moduleRef.createNestApplication();
		prisma = moduleRef.get(PrismaService);
		studentFactory = moduleRef.get(StudentFactory);
		answerFactory = moduleRef.get(AnswerFactory);
		answerCommentFactory = moduleRef.get(AnswerCommentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		jwt = moduleRef.get(JwtService);

		await app.init();
	});

	test('[GET] /answers/:answerId/comments', async () => {
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

		await Promise.all([
			answerCommentFactory.makePrismaAnswerComment({
				answerId: answer.id,
				authorId: user.id,
				content: 'Comment 1',
			}),
			answerCommentFactory.makePrismaAnswerComment({
				answerId: answer.id,
				authorId: user.id,
				content: 'Comment 2',
			}),
		]);

		const response = await request(app.getHttpServer())
			.get(`/answers/${answer.id.toString()}/comments`)
			.set('Authorization', `Bearer ${accessToken}`)
			.query({
				page: 1,
				limit: 10,
			});

		expect(response.status).toBe(200);
		expect(response.body).toEqual({
			answerComments: expect.arrayContaining([
				expect.objectContaining({
					content: 'Comment 1',
				}),
				expect.objectContaining({
					content: 'Comment 2',
				}),
			]),
		});
	});

	test('[GET] /answers/:answerId/comments - should validate pagination params', async () => {
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
			.get(`/answers/${answer.id.toString()}/comments`)
			.set('Authorization', `Bearer ${accessToken}`)
			.query({
				page: 'invalid',
				limit: 0,
			});

		expect(response.status).toBe(400);
	});

	test('[GET] /answers/:answerId/comments - should return empty array when no comments', async () => {
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
			.get(`/answers/${answer.id.toString()}/comments`)
			.set('Authorization', `Bearer ${accessToken}`)
			.query({
				page: 1,
				limit: 10,
			});

		expect(response.status).toBe(200);
		expect(response.body).toEqual({
			answerComments: [],
		});
	});
});
