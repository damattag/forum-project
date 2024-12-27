import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student.usecase';
import {
	type AuthenticateBodySchema,
	authenticateBodyValidationSchema,
} from '@/infra/http/dtos/authenticate.dto';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

@Controller('/sessions')
export class AuthenticateController {
	constructor(private readonly useCase: AuthenticateStudentUseCase) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async handle(@Body(authenticateBodyValidationSchema) body: AuthenticateBodySchema) {
		const { email, password } = body;

		const result = await this.useCase.execute({ email, password });

		if (result.isLeft()) {
			throw new Error('Something went wrong');
		}

		const { accessToken } = result.value;

		return {
			access_token: accessToken,
		};
	}
}
