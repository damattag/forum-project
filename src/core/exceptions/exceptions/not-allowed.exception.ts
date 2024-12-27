import type { UseCaseException } from '@/core/exceptions/use-case-exceptions';

export class NotAllowedException extends Error implements UseCaseException {
	constructor() {
		super('Not allowed');
	}
}
