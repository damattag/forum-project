import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';

describe('Fetch recent questions (E2E)', () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let jwt: JwtService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleRef.createNestApplication();
		prisma = moduleRef.get(PrismaService);
		jwt = moduleRef.get(JwtService);

		await app.init();
	});

	test('[GET] /questions', async () => {
		const user = await prisma.user.create({
			data: {
				name: 'John Doe',
				email: 'john.doe@example.com',
				password: '123456',
			},
		});

		const accessToken = jwt.sign({
			sub: user.id,
		});

		await prisma.question.createMany({
			data: [
				{
					title: 'What is the meaning of life?',
					content: 'The meaning of life, the universe, and everything',
					authorId: user.id,
					slug: 'what-is-the-meaning-of-life',
				},
				{
					title: 'What is the meaning of lifes',
					content: 'The meaning of life, the universe, and everything',
					authorId: user.id,
					slug: 'what-is-the-meaning-of-lifes',
				},
			],
		});

		const response = await request(app.getHttpServer())
			.get('/questions')
			.set('Authorization', `Bearer ${accessToken}`);

		expect(response.status).toBe(200);
		expect(response.body.questions).toHaveLength(2);
		expect(response.body.questions[0].title).toBe('What is the meaning of life?');
	});
});
