import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
	Student,
	type StudentProps,
} from '@/domain/forum/enterprise/entities/student.entity';
import { PrismaStudentMapper } from '@/infra/database/prisma/mappers/student-mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeStudent(
	override: Partial<StudentProps> = {},
	id?: UniqueEntityId,
): Student {
	const student = Student.create(
		{
			email: faker.internet.email(),
			name: faker.person.fullName(),
			password: faker.internet.password(),
			...override,
		},
		id,
	);

	return student;
}

@Injectable()
export class StudentFactory {
	constructor(private readonly prisma: PrismaService) {}

	async makePrismaStudent(data: Partial<StudentProps> = {}): Promise<Student> {
		const student = makeStudent(data);

		await this.prisma.user.create({
			data: PrismaStudentMapper.toPersistence(student),
		});

		return student;
	}
}
