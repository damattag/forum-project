import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student.usecase';
import {
	type CreateAccountBodySchema,
	createAccountBodyValidationSchema,
} from '@/infra/http/dtos/create-account.dto';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

@Controller('/accounts')
export class CreateAccountController {
	constructor(private readonly useCase: RegisterStudentUseCase) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async handle(@Body(createAccountBodyValidationSchema) body: CreateAccountBodySchema) {
		const { name, email, password } = body;

		await this.useCase.execute({ name, email, password });
	}
}
