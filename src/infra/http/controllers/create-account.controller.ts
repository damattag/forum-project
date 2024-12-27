import { PrismaService } from '@/infra/database/prisma/prisma.service';
import {
	type CreateAccountBodySchema,
	createAccountBodyValidationSchema,
} from '@/infra/http/dtos/create-account.dto';
import {
	Body,
	ConflictException,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
} from '@nestjs/common';
import { hash } from 'bcryptjs';

@Controller('/accounts')
export class CreateAccountController {
	constructor(private readonly prisma: PrismaService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async handle(@Body(createAccountBodyValidationSchema) body: CreateAccountBodySchema) {
		const { name, email, password } = body;

		const userWithSameEmail = await this.prisma.user.findUnique({
			where: {
				email,
			},
		});

		if (userWithSameEmail) {
			throw new ConflictException('User with this email already exists');
		}

		const hashedPassword = await hash(password, 8);

		return this.prisma.user.create({
			data: {
				email,
				name,
				password: hashedPassword,
			},
		});
	}
}
