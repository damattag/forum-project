import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import {
	type AuthenticateBodySchema,
	authenticateBodyValidationSchema,
} from '../dtos/authenticate.dto';

@Controller('/sessions')
export class AuthenticateController {
	constructor(
		private readonly jwt: JwtService,
		private readonly prisma: PrismaService,
	) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async handle(@Body(authenticateBodyValidationSchema) body: AuthenticateBodySchema) {
		const { email, password } = body;

		const user = await this.prisma.user.findUnique({
			where: {
				email,
			},
		});

		if (!user) {
			throw new UnauthorizedException('invalid credentials');
		}

		const isPasswordCorrect = await compare(password, user.password);

		if (!isPasswordCorrect) {
			throw new UnauthorizedException('invalid credentials');
		}

		const accessToken = this.jwt.sign({ sub: user.id });

		return {
			access_token: accessToken,
		};
	}
}
