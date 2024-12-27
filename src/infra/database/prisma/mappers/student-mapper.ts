import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Student } from '@/domain/forum/enterprise/entities/student.entity';
import type { Prisma, User as PrismaUser } from '@prisma/client';

export class PrismaStudentMapper {
	static toDomain(student: PrismaUser): Student {
		return Student.create(
			{
				name: student.name,
				email: student.email,
				password: student.password,
			},
			new UniqueEntityId(student.id),
		);
	}

	static toPersistence(student: Student): Prisma.UserUncheckedCreateInput {
		return {
			id: student.id.toString(),
			name: student.name,
			email: student.email,
			password: student.password,
		};
	}
}
