import {
	FetchRecentQuestionsQueryParamsSchema,
	fetchRecentQuestionsQueryParamsValidationSchema,
} from '@/infra/http/dtos/fetch-recent-questions.dto';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('/questions')
@UseGuards(AuthGuard('jwt'))
export class FetchRecentQuestionsController {
	constructor(private readonly prisma: PrismaService) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	async handle(
		@Query(fetchRecentQuestionsQueryParamsValidationSchema)
		queryRaw: FetchRecentQuestionsQueryParamsSchema,
	) {
		const { page, limit } = queryRaw;

		const questions = await this.prisma.question.findMany({
			orderBy: {
				createdAt: 'desc',
			},
			take: limit,
			skip: (page - 1) * limit,
		});

		return { questions };
	}
}
