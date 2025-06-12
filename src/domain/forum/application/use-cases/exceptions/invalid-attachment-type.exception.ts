import { UseCaseException } from '@/core/exceptions/use-case-exceptions';

export class InvalidAttachmentTypeException extends Error implements UseCaseException {
	constructor(fileType: string) {
		super(`Invalid attachment type: ${fileType}.`);
	}
}
