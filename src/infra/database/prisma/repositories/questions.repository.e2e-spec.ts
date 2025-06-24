import { QuestionsRepository } from '@/domain/forum/application/repositories/questions.repository';
import { AppModule } from '@/infra/app.module';
import { CacheModule } from '@/infra/cache/cache.module';
import { CacheRepository } from '@/infra/cache/cache.repository';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AttachmentFactory } from 'test/factories/make-attachment';
import { QuestionFactory } from 'test/factories/make-question';
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachment';
import { StudentFactory } from 'test/factories/make-student';

describe('Questions repository (E2E)', () => {
	let app: INestApplication;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let attachmentFactory: AttachmentFactory;
	let questionAttachmentFactory: QuestionAttachmentFactory;
	let questionsRepository: QuestionsRepository;
	let cacheRepository: CacheRepository;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule, CacheModule],
			providers: [
				StudentFactory,
				QuestionFactory,
				AttachmentFactory,
				QuestionAttachmentFactory,
			],
		}).compile();

		app = moduleRef.createNestApplication();
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		attachmentFactory = moduleRef.get(AttachmentFactory);
		questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);
		cacheRepository = moduleRef.get(CacheRepository);
		questionsRepository = moduleRef.get(QuestionsRepository);

		await app.init();
	});

	it('should cache question details', async () => {
		const user = await studentFactory.makePrismaStudent();

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const attachment = await attachmentFactory.makePrismaAttachment();

		await questionAttachmentFactory.makePrismaQuestionAttachment({
			questionId: question.id,
			attachmentId: attachment.id,
		});

		const slug = question.slug.value;
		const cacheKey = `questions:${slug}:details`;

		const questionDetails = await questionsRepository.findDetailsBySlug(slug);

		const cachedQuestion = await cacheRepository.get(cacheKey);

		if (!cachedQuestion) {
			throw new Error('Cached question not found');
		}

		expect(JSON.parse(cachedQuestion)).toEqual(
			expect.objectContaining({
				title: question.title,
				content: question.content,
			}),
		);
	});

	it('should cache question details on subsequent calls', async () => {
		const user = await studentFactory.makePrismaStudent();

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const attachment = await attachmentFactory.makePrismaAttachment();

		await questionAttachmentFactory.makePrismaQuestionAttachment({
			questionId: question.id,
			attachmentId: attachment.id,
		});

		const slug = question.slug.value;

		const cacheKey = `questions:${slug}:details`;

		let cached = await cacheRepository.get(cacheKey);

		expect(cached).toBeNull();

		await questionsRepository.findDetailsBySlug(slug);

		cached = await cacheRepository.get(cacheKey);

		expect(cached).not.toBeNull();

		const questionDetails = await questionsRepository.findDetailsBySlug(slug);

		if (!cached) {
			throw new Error('Cached question not found');
		}

		expect(JSON.parse(cached)).toEqual(
			expect.objectContaining({
				title: questionDetails?.title,
				content: questionDetails?.content,
			}),
		);
	});

	it('should delete cache when question is updated', async () => {
		const user = await studentFactory.makePrismaStudent();

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const attachment = await attachmentFactory.makePrismaAttachment();

		await questionAttachmentFactory.makePrismaQuestionAttachment({
			questionId: question.id,
			attachmentId: attachment.id,
		});

		const slug = question.slug.value;
		const cacheKey = `questions:${slug}:details`;

		await cacheRepository.set(cacheKey, JSON.stringify({ empty: true }));
	});
});
