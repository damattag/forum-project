import { UseCaseException } from '@/core/exceptions/use-case-exceptions';

export class InvalidCredentialsException extends Error implements UseCaseException {
	constructor() {
		super('Invalid credentials.');
	}
}
