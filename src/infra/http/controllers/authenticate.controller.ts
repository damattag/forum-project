import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student.usecase';
import { InvalidCredentialsException } from '@/domain/forum/application/use-cases/exceptions/invalid-credentials.exception';
import {
	type AuthenticateBodySchema,
	authenticateBodyValidationSchema,
} from '@/infra/http/dtos/authenticate.dto';
import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	UnauthorizedException,
} from '@nestjs/common';

@Controller('/sessions')
export class AuthenticateController {
	constructor(private readonly useCase: AuthenticateStudentUseCase) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async handle(@Body(authenticateBodyValidationSchema) body: AuthenticateBodySchema) {
		const { email, password } = body;

		const result = await this.useCase.execute({ email, password });

		if (result.isLeft()) {
			const error = result.value;

			switch (error.constructor) {
				case InvalidCredentialsException:
					throw new UnauthorizedException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

		const { accessToken } = result.value;

		return {
			access_token: accessToken,
		};
	}
}
