import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { QuestionFactory } from 'test/factories/make-question';
import { QuestionCommentFactory } from 'test/factories/make-question-comment';
import { StudentFactory } from 'test/factories/make-student';

describe('Delete question comment (E2E)', () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let studentFactory: StudentFactory;
	let questionCommentFactory: QuestionCommentFactory;
	let questionFactory: QuestionFactory;
	let jwt: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, QuestionCommentFactory, QuestionFactory],
		}).compile();

		app = moduleRef.createNestApplication();
		prisma = moduleRef.get(PrismaService);
		studentFactory = moduleRef.get(StudentFactory);
		questionCommentFactory = moduleRef.get(QuestionCommentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		jwt = moduleRef.get(JwtService);

		await app.init();
	});

	test('[DELETE] /questions/comments/id/:id', async () => {
		const user = await studentFactory.makePrismaStudent();
		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});
		const questionComment = await questionCommentFactory.makePrismaQuestionComment({
			authorId: user.id,
			questionId: question.id,
		});

		const accessToken = jwt.sign({
			sub: user.id.toString(),
		});

		const response = await request(app.getHttpServer())
			.delete(`/questions/comments/id/${questionComment.id.toString()}`)
			.set('Authorization', `Bearer ${accessToken}`);

		expect(response.status).toBe(204);

		const questionCommentOnDatabase = await prisma.comment.findFirst({
			where: {
				id: questionComment.id.toString(),
			},
		});

		expect(questionCommentOnDatabase).toBeNull();
	});

	test('[DELETE] /questions/comments/id/:id - should not be able to delete another user question comment', async () => {
		const user = await studentFactory.makePrismaStudent();
		const anotherUser = await studentFactory.makePrismaStudent();
		const question = await questionFactory.makePrismaQuestion({
			authorId: anotherUser.id,
		});

		const accessToken = jwt.sign({
			sub: user.id.toString(),
		});

		const questionComment = await questionCommentFactory.makePrismaQuestionComment({
			authorId: anotherUser.id,
			questionId: question.id,
		});

		const response = await request(app.getHttpServer())
			.delete(`/questions/comments/id/${questionComment.id.toString()}`)
			.set('Authorization', `Bearer ${accessToken}`);

		expect(response.status).toBe(400);

		const questionCommentOnDatabase = await prisma.comment.findFirst({
			where: {
				id: questionComment.id.toString(),
			},
		});

		expect(questionCommentOnDatabase).toBeTruthy();
	});
});
