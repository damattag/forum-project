import { EnvModule } from '@/infra/env/env.module';
import { EnvService } from '@/infra/env/env.service';
import type { Env } from '@/infra/env/handler';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
	imports: [
		EnvModule,
		PassportModule,
		JwtModule.registerAsync({
			inject: [ConfigService<Env, true>],
			global: true,
			useFactory(envService: EnvService) {
				const privateKey = envService.get('JWT_PRIVATE_KEY');
				const publicKey = envService.get('JWT_PUBLIC_KEY');

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
	providers: [JwtStrategy],
})
export class AuthModule {}
