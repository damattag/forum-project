import { Uploader } from '@/domain/forum/application/storage/uploader';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { StudentFactory } from 'test/factories/make-student';

describe('Upload attachment (E2E)', () => {
	let app: INestApplication;
	let studentFactory: StudentFactory;
	let jwt: JwtService;
	let uploader: Uploader;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [
				StudentFactory,
				{
					provide: Uploader,
					useValue: {
						upload: vi.fn(),
					},
				},
			],
		}).compile();

		app = moduleRef.createNestApplication();
		studentFactory = moduleRef.get(StudentFactory);
		uploader = moduleRef.get(Uploader);
		jwt = moduleRef.get(JwtService);

		await app.init();
	});

	test('[POST] /attachments', async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({
			sub: user.id.toString(),
		});

		vi.spyOn(uploader, 'upload').mockResolvedValue({
			url: 'attachment.png',
		}); // mocked because i cannot pay for the storage in this moment, but in ideal scenario, we would use a real storage to test E2E

		const response = await request(app.getHttpServer())
			.post('/attachments')
			.set('Authorization', `Bearer ${accessToken}`)
			.attach('file', 'test/e2e/sample-upload.png');

		expect(response.status).toBe(201);
		expect(response.body).toEqual({
			attachmentId: expect.any(String),
		});
	});
});
