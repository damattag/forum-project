import { UseCaseException } from '@/core/exceptions/use-case-exceptions';

export class StudentAlreadyExistsException extends Error implements UseCaseException {
	constructor(identifier: string) {
		super(`Student "${identifier}" already exists.`);
	}
}
