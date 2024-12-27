import { StudentAlreadyExistsException } from '@/domain/forum/application/use-cases/exceptions/student-already-exists.exception';
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student.usecase';
import { Public } from '@/infra/auth/public';
import {
	type CreateAccountBodySchema,
	createAccountBodyValidationSchema,
} from '@/infra/http/dtos/create-account.dto';
import {
	BadRequestException,
	Body,
	ConflictException,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
} from '@nestjs/common';

@Controller('/accounts')
@Public()
export class CreateAccountController {
	constructor(private readonly useCase: RegisterStudentUseCase) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async handle(@Body(createAccountBodyValidationSchema) body: CreateAccountBodySchema) {
		const { name, email, password } = body;

		const result = await this.useCase.execute({ name, email, password });

		if (result.isLeft()) {
			const error = result.value;

			switch (error.constructor) {
				case StudentAlreadyExistsException:
					throw new ConflictException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}
	}
}
