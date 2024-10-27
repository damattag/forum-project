import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvService } from 'src/env/env.service';
import { z } from 'zod';

const tokenSchema = z.object({
	sub: z.string().uuid(),
});

type TokenSchema = z.infer<typeof tokenSchema>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(envService: EnvService) {
		const publicKey = envService.get('JWT_PUBLIC_KEY');

		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: publicKey,
			algorithms: ['RS256'],
		});
	}

	async validate(payload: TokenSchema) {
		return tokenSchema.parse(payload);
	}
}
