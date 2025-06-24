import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from './cache/cache.module';
import { DatabaseModule } from './database/database.module';
import { EnvModule } from './env/env.module';
import { envSchema } from './env/handler';
import { EventsModule } from './events/events.module';
import { HttpModule } from './http/http.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			validate: (env) => envSchema.parse(env),
			isGlobal: true,
		}),
		AuthModule,
		HttpModule,
		EnvModule,
		DatabaseModule,
		EventsModule,
		CacheModule,
	],
})
export class AppModule {}
