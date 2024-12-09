import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { EnvModule } from "@/env/env.module";
import { EnvService } from "@/env/env.service";
import type { Env } from "@/env/handler";
import { JwtStrategy } from "./jwt.strategy";

@Module({
  imports: [
    EnvModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService<Env, true>],
      global: true,
      useFactory(envService: EnvService) {
        const privateKey = envService.get("JWT_PRIVATE_KEY");
        const publicKey = envService.get("JWT_PUBLIC_KEY");

        return {
          signOptions: {
            algorithm: "RS256",
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
