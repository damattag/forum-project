import {
	UploadInput,
	UploadOutput,
	Uploader,
} from '@/domain/forum/application/storage/uploader';
import { faker } from '@faker-js/faker';

interface Upload {
	fileName: string;
	url: string;
}

export class FakeUploader implements Uploader {
	public uploads: Upload[] = [];

	async upload(input: UploadInput): Promise<UploadOutput> {
		const { fileName } = input;

		const url = faker.internet.url();

		this.uploads.push({ fileName, url });

		return { url };
	}
}
