import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { UserPayload } from 'src/auth/jwt.strategy';
import {
	CreateQuestionBodySchema,
	createQuestionBodyValidationSchema,
} from 'src/dtos/create-question.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('/questions')
@UseGuards(AuthGuard('jwt'))
export class CreateQuestionController {
	constructor(private readonly prisma: PrismaService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async handle(
		@CurrentUser() user: UserPayload,
		@Body(createQuestionBodyValidationSchema) body: CreateQuestionBodySchema,
	) {
		const { title, content } = body;

		await this.prisma.question.create({
			data: {
				title,
				content,
				slug: this.convertToSlug(title),
				authorId: user.sub,
			},
		});
	}

	private convertToSlug(title: string) {
		return title
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/[^\w\s~]/g, '')
			.replace(/\s+/g, '-');
	}
}
