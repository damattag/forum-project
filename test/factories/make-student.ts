import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
	Student,
	type StudentProps,
} from '@/domain/forum/enterprise/entities/student.entity';
import { faker } from '@faker-js/faker';

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
