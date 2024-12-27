import { type Either, left, right } from '@/core/either';
import { StudentsRepository } from '@/domain/forum/application/repositories/students.repository';
import { Student } from '@/domain/forum/enterprise/entities/student.entity';
import { Injectable } from '@nestjs/common';
import { HashGenerator } from '../cryptography/hash-generator';
import { StudentAlreadyExistsException } from './exceptions/student-already-exists.exception';

interface RegisterStudentUseCaseRequest {
	name: string;
	email: string;
	password: string;
}

type RegisterStudentUseCaseResponse = Either<
	StudentAlreadyExistsException,
	{ student: Student }
>;

@Injectable()
export class RegisterStudentUseCase {
	constructor(
		private readonly studentsRepository: StudentsRepository,
		private readonly hashGenerator: HashGenerator,
	) {}

	async execute({
		name,
		email,
		password,
	}: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
		const studentWithSameEmail = await this.studentsRepository.findByEmail(email);

		if (studentWithSameEmail) {
			return left(new StudentAlreadyExistsException(email));
		}

		const hashedPassword = await this.hashGenerator.hash(password);

		const student = Student.create({
			name,
			email,
			password: hashedPassword,
		});

		await this.studentsRepository.create(student);

		return right({
			student,
		});
	}
}
