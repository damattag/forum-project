import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import type { Env } from 'src/env';

@Module({
	imports: [
		PassportModule,
		JwtModule.registerAsync({
			inject: [ConfigService<Env, true>],
			global: true,
			useFactory(configService: ConfigService<Env, true>) {
				const privateKey = configService.get('JWT_PRIVATE_KEY', { infer: true });
				const publicKey = configService.get('JWT_PUBLIC_KEY', { infer: true });

				return {
					signOptions: {
						algorithm: 'RS256',
					},
					privateKey,
					publicKey,
				};
			},
		}),
	],
})
export class AuthModule {}
