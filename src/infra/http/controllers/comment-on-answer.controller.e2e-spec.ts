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

describe('Comment on answer (E2E)', () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let answersFactory: AnswerFactory;
	let jwt: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, AnswerFactory, QuestionFactory],
		}).compile();

		app = moduleRef.createNestApplication();
		prisma = moduleRef.get(PrismaService);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		answersFactory = moduleRef.get(AnswerFactory);
		jwt = moduleRef.get(JwtService);

		await app.init();
	});

	test('[POST] /answers/answer_id/:answer_id/comments', async () => {
		const user = await studentFactory.makePrismaStudent();

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const accessToken = jwt.sign({
			sub: user.id.toString(),
		});

		const answer = await answersFactory.makePrismaAnswer({
			authorId: user.id,
			questionId: question.id,
		});

		const response = await request(app.getHttpServer())
			.post(`/answers/answer_id/${answer.id.toString()}/comments`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				content: 'The meaning of life is be happy',
			});

		expect(response.status).toBe(201);

		const answerCommentOnDatabase = await prisma.comment.findFirst({
			where: {
				content: 'The meaning of life is be happy',
			},
		});

		expect(answerCommentOnDatabase).toBeTruthy();
	});
});
