import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import z from 'zod';

export const readNotificationParamsValidationSchema = z.object({
	id: z.string(),
});

export const readNotificationParamsValidationPipe = new ZodValidationPipe(
	readNotificationParamsValidationSchema,
);

export type ReadNotificationParamsSchema = z.infer<
	typeof readNotificationParamsValidationSchema
>;
