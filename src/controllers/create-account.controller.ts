import { ConflictException } from '@nestjs/common';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { hash } from 'bcryptjs';
import {
	type CreateAccountBodySchema,
	createAccountBodyValidationSchema,
} from '../dtos/create-account.dto';
import { PrismaService } from '../prisma/prisma.service';

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
