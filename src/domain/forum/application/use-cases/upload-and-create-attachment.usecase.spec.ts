import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments.repository';
import { FakeUploader } from 'test/storage/fake-uploader';
import { InvalidAttachmentTypeException } from './exceptions/invalid-attachment-type.exception';
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment.usecase';

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let fakeUploader: FakeUploader;
let sut: UploadAndCreateAttachmentUseCase;

describe('Upload Attachment', () => {
	beforeEach(() => {
		inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
		fakeUploader = new FakeUploader();

		sut = new UploadAndCreateAttachmentUseCase(
			inMemoryAttachmentsRepository,
			fakeUploader,
		);
	});

	it('should be able to upload and create an attachment', async () => {
		const result = await sut.execute({
			fileName: 'test.png',
			fileType: 'image/png',
			body: Buffer.from(''),
		});

		expect(result.isRight()).toBe(true);
		expect(result.value).toEqual({
			attachment: inMemoryAttachmentsRepository.items[0],
		});

		expect(fakeUploader.uploads).toHaveLength(1);
		expect(fakeUploader.uploads[0]).toEqual(
			expect.objectContaining({
				fileName: 'test.png',
				url: expect.any(String),
			}),
		);
	});

	it('should not be able to upload an attachment with invalid file type', async () => {
		const result = await sut.execute({
			fileName: 'test.json',
			fileType: 'text/json',
			body: Buffer.from(''),
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(InvalidAttachmentTypeException);
	});
});
