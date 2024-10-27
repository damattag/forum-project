import { Module } from '@nestjs/common';
import { CreateAccountController } from './controllers/create-account.controller';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env/handler';
import { EnvModule } from './env/env.module';


@Module({
  imports: [
    ConfigModule.forRoot({
    validate: (env) => envSchema.parse(env),
    isGlobal: true,
  }),
    EnvModule],
  controllers: [CreateAccountController],
  providers: [PrismaService],
})
export class AppModule {}
