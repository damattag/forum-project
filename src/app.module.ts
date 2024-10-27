import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AuthenticateController } from './controllers/authenticate.controller';
import { CreateAccountController } from './controllers/create-account.controller';
import { CreateQuestionController } from './controllers/create-question.controller';
import { envSchema } from './env/handler';
import { PrismaService } from './prisma/prisma.service';
import { EnvModule } from './env/env.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			validate: (env) => envSchema.parse(env),
			isGlobal: true,
		}),
		AuthModule,
		EnvModule,
	],
	controllers: [
		CreateAccountController,
		AuthenticateController,
		CreateQuestionController,
	],
	providers: [PrismaService],
})
export class AppModule {}
