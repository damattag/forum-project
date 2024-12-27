import type { UseCaseException } from '@/core/exceptions/use-case-exceptions';

export class ResourceNotFoundException extends Error implements UseCaseException {
	constructor() {
		super('Resource not found');
	}
}
