import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import {
	CreateQuestionBodySchema,
	createQuestionBodyValidationSchema,
} from '@/infra/http/dtos/create-question.dto';
import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

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
