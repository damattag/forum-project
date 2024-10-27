import { Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { UserPayload } from 'src/auth/jwt.strategy';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('/questions')
@UseGuards(AuthGuard('jwt'))
export class CreateQuestionController {
	constructor(
		private readonly jwt: JwtService,
		private readonly prisma: PrismaService,
	) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async handle(@CurrentUser() user: UserPayload) {
		return 'ok';
	}
}
