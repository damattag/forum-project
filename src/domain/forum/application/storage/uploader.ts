export interface UploadInput {
	fileName: string;
	fileType: string;
	body: Buffer;
}

export interface UploadOutput {
	url: string;
}

export abstract class Uploader {
	abstract upload(input: UploadInput): Promise<UploadOutput>;
}
