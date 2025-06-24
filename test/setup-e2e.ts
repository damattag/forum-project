import { DomainEvents } from '@/core/events/domains-events';
import { envSchema } from '@/infra/env/handler';
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
import Redis from 'ioredis';
import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';

config({
	path: '.env',
	override: true,
});
config({
	path: '.env.test',
	override: true,
});

const env = envSchema.parse(process.env);

const prisma = new PrismaClient();

const redis = new Redis({
	host: env.REDIS_HOST,
	port: env.REDIS_PORT,
	db: env.REDIS_DB,
});

function generateUniqueDatabaseURL(schemaId: string) {
	if (!env.DATABASE_URL) {
		throw new Error('DATABASE_URL is not set');
	}

	const url = new URL(env.DATABASE_URL);

	url.searchParams.set('schema', schemaId);

	return url.toString();
}

const schemaId = randomUUID();

beforeAll(async () => {
	const databaseURL = generateUniqueDatabaseURL(schemaId);

	DomainEvents.shouldRun = false;

	env.DATABASE_URL = databaseURL;

	await redis.flushdb();

	execSync('npx prisma migrate deploy');
});

afterAll(async () => {
	await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
	await prisma.$disconnect();
});
