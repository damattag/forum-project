import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod';

export const createAccountBodySchema = z.object({
	name: z.string(),
	email: z.string().email(),
	password: z.string(),
});

export type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

export const createAccountBodyValidationSchema = new ZodValidationPipe(
	createAccountBodySchema,
);
