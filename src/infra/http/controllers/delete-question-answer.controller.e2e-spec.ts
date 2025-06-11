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

describe('Delete answer comment (E2E)', () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let studentFactory: StudentFactory;
	let answerCommentFactory: AnswerCommentFactory;
	let questionFactory: QuestionFactory;
	let answerFactory: AnswerFactory;
	let jwt: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, AnswerCommentFactory, QuestionFactory, AnswerFactory],
		}).compile();

		app = moduleRef.createNestApplication();
		prisma = moduleRef.get(PrismaService);
		studentFactory = moduleRef.get(StudentFactory);
		answerCommentFactory = moduleRef.get(AnswerCommentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		answerFactory = moduleRef.get(AnswerFactory);
		jwt = moduleRef.get(JwtService);

		await app.init();
	});

	test('[DELETE] /answers/comments/id/:id', async () => {
		const user = await studentFactory.makePrismaStudent();
		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});
		const answer = await answerFactory.makePrismaAnswer({
			authorId: user.id,
			questionId: question.id,
		});
		const answerComment = await answerCommentFactory.makePrismaAnswerComment({
			authorId: user.id,
			answerId: answer.id,
		});

		const accessToken = jwt.sign({
			sub: user.id.toString(),
		});

		const response = await request(app.getHttpServer())
			.delete(`/answers/comments/id/${answerComment.id.toString()}`)
			.set('Authorization', `Bearer ${accessToken}`);

		expect(response.status).toBe(204);

		const answerCommentOnDatabase = await prisma.comment.findFirst({
			where: {
				id: answerComment.id.toString(),
			},
		});

		expect(answerCommentOnDatabase).toBeNull();
	});

	test('[DELETE] /answers/comments/id/:id - should not be able to delete another user answer comment', async () => {
		const user = await studentFactory.makePrismaStudent();
		const anotherUser = await studentFactory.makePrismaStudent();
		const question = await questionFactory.makePrismaQuestion({
			authorId: anotherUser.id,
		});
		const answer = await answerFactory.makePrismaAnswer({
			authorId: anotherUser.id,
			questionId: question.id,
		});

		const accessToken = jwt.sign({
			sub: user.id.toString(),
		});

		const answerComment = await answerCommentFactory.makePrismaAnswerComment({
			authorId: anotherUser.id,
			answerId: answer.id,
		});

		const response = await request(app.getHttpServer())
			.delete(`/answers/comments/id/${answerComment.id.toString()}`)
			.set('Authorization', `Bearer ${accessToken}`);

		expect(response.status).toBe(400);

		const answerCommentOnDatabase = await prisma.comment.findFirst({
			where: {
				id: answerComment.id.toString(),
			},
		});

		expect(answerCommentOnDatabase).toBeTruthy();
	});
});
