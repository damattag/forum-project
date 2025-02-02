import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from './handler';

@Injectable()
export class EnvService {
	constructor(private readonly configService: ConfigService<Env, true>) {}

	get<T extends keyof Env>(key: T): Env[T] {
		return this.configService.get<Env>(key, { infer: true });
	}
}
