import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod';

export const authenticateBodySchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

export type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

export const authenticateBodyValidationSchema = new ZodValidationPipe(
	authenticateBodySchema,
);
