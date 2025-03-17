import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { QuestionFactory } from 'test/factories/make-question';
import { StudentFactory } from 'test/factories/make-student';

describe('Create Answer (E2E)', () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let studentFactory: StudentFactory;
	let questionsFactory: QuestionFactory;
	let jwt: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, QuestionFactory],
		}).compile();

		app = moduleRef.createNestApplication();
		prisma = moduleRef.get(PrismaService);
		studentFactory = moduleRef.get(StudentFactory);
		questionsFactory = moduleRef.get(QuestionFactory);
		jwt = moduleRef.get(JwtService);

		await app.init();
	});

	test('[POST] /questions/question_id/:question_id/answers', async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({
			sub: user.id.toString(),
		});

		const question = await questionsFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const response = await request(app.getHttpServer())
			.post(`/questions/question_id/${question.id.toString()}/answers`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				content: 'The meaning of life is be happy',
			});

		expect(response.status).toBe(201);

		const answerOnDatabase = await prisma.answer.findFirst({
			where: {
				content: 'The meaning of life is be happy',
			},
		});

		expect(answerOnDatabase).toBeTruthy();
	});
});
