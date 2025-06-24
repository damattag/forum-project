import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification.usecase';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import {
	ReadNotificationParamsSchema,
	readNotificationParamsValidationPipe,
} from '@/infra/http/dtos/read-notification.dto';
import {
	BadRequestException,
	Controller,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
} from '@nestjs/common';

@Controller('/notifications/:id/read')
export class ReadNotificationController {
	constructor(private readonly useCase: ReadNotificationUseCase) {}

	@Patch()
	@HttpCode(HttpStatus.NO_CONTENT)
	async handle(
		@Param(readNotificationParamsValidationPipe)
		params: ReadNotificationParamsSchema,
		@CurrentUser() user: UserPayload,
	) {
		const { id } = params;

		const result = await this.useCase.execute({
			notificationId: id,
			recipientId: user.sub,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}
