import { EnvModule } from '@/infra/env/env.module';
import { EnvService } from '@/infra/env/env.service';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';

@Module({
	imports: [
		PassportModule,
		JwtModule.registerAsync({
			imports: [EnvModule],
			inject: [EnvService],
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
	providers: [
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
		JwtStrategy,
		EnvService,
	],
})
export class AuthModule {}
