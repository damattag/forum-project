import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { QuestionFactory } from 'test/factories/make-question';
import { QuestionCommentFactory } from 'test/factories/make-question-comment';
import { StudentFactory } from 'test/factories/make-student';

describe('Fetch question comments (E2E)', () => {
	let app: INestApplication;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let questionCommentFactory: QuestionCommentFactory;
	let jwt: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, QuestionFactory, QuestionCommentFactory],
		}).compile();

		app = moduleRef.createNestApplication();
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		questionCommentFactory = moduleRef.get(QuestionCommentFactory);
		jwt = moduleRef.get(JwtService);

		await app.init();
	});

	test('[GET] /questions/:questionId/comments', async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({
			sub: user.id.toString(),
		});

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		await Promise.all([
			questionCommentFactory.makePrismaQuestionComment({
				questionId: question.id,
				authorId: user.id,
				content: 'Question comment 1',
			}),
			questionCommentFactory.makePrismaQuestionComment({
				questionId: question.id,
				authorId: user.id,
				content: 'Question comment 2',
			}),
		]);

		const response = await request(app.getHttpServer())
			.get(`/questions/${question.id.toString()}/comments`)
			.set('Authorization', `Bearer ${accessToken}`);

		expect(response.status).toBe(200);
		expect(response.body.comments).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					content: 'Question comment 1',
				}),
				expect.objectContaining({
					content: 'Question comment 2',
				}),
			]),
		);
	});

	test('[GET] /questions/:questionId/comments - should validate pagination params', async () => {
		const user = await studentFactory.makePrismaStudent();
		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const accessToken = jwt.sign({
			sub: user.id.toString(),
		});

		const response = await request(app.getHttpServer())
			.get(`/questions/${question.id.toString()}/comments`)
			.set('Authorization', `Bearer ${accessToken}`)
			.query({
				page: 'invalid',
				limit: 0,
			});

		expect(response.status).toBe(400);
	});

	test('[GET] /questions/:questionId/comments - should return empty array when no comments', async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({
			sub: user.id.toString(),
		});

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const response = await request(app.getHttpServer())
			.get(`/questions/${question.id.toString()}/comments`)
			.set('Authorization', `Bearer ${accessToken}`);

		expect(response.status).toBe(200);
		expect(response.body).toEqual({
			comments: [],
		});
	});
});
