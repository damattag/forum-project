import {
	UploadInput,
	UploadOutput,
	Uploader,
} from '@/domain/forum/application/storage/uploader';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { EnvService } from '../env/env.service';

@Injectable()
export class R2Storage implements Uploader {
	private client: S3Client;
	private bucket: string;

	constructor(private readonly envService: EnvService) {
		const accountId = envService.get('CLOUDFLARE_ACCOUNT_ID');
		const accessKeyId = envService.get('S3_ACCESS_KEY_ID');
		const secretAccessKey = envService.get('S3_SECRET_KEY');

		this.bucket = envService.get('S3_BUCKET_NAME');

		this.client = new S3Client({
			endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
			region: 'auto',
			credentials: {
				accessKeyId,
				secretAccessKey,
			},
		});
	}

	async upload(input: UploadInput): Promise<UploadOutput> {
		const { fileName, fileType, body } = input;

		const uploadId = randomUUID();

		const putCommand = new PutObjectCommand({
			Bucket: this.bucket,
			Key: `${uploadId}-${fileName}`,
			Body: body,
			ContentType: fileType,
		});

		await this.client.send(putCommand);

		return {
			url: `https://${this.bucket}.r2.cloudflarestorage.com/${uploadId}-${fileName}`,
		};
	}
}
