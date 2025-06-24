import { EnvModule } from '@/infra/env/env.module';
import { Module } from '@nestjs/common';
import { CacheRepository } from './cache.repository';
import { RedisRepository } from './redis/redis.repository';
import { RedisService } from './redis/redis.service';

@Module({
	imports: [EnvModule],
	providers: [
		{
			provide: CacheRepository,
			useClass: RedisRepository,
		},
		RedisService,
	],
	exports: [CacheRepository],
})
export class CacheModule {}
