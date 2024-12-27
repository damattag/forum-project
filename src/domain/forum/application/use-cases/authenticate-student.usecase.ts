import { type Either, left, right } from '@/core/either';
import { StudentsRepository } from '@/domain/forum/application/repositories/students.repository';
import { Injectable } from '@nestjs/common';
import { Encrypter } from '../cryptography/encrypter';
import { HashComparer } from '../cryptography/hash-comparer';
import { InvalidCredentialsException } from './exceptions/invalid-credentials.exception';

interface AuthenticateStudentUseCaseRequest {
	email: string;
	password: string;
}

type AuthenticateStudentUseCaseResponse = Either<
	InvalidCredentialsException,
	{ accessToken: string }
>;

@Injectable()
export class AuthenticateStudentUseCase {
	constructor(
		private readonly studentsRepository: StudentsRepository,
		private readonly hashComparer: HashComparer,
		private readonly encrypter: Encrypter,
	) {}

	async execute({
		email,
		password,
	}: AuthenticateStudentUseCaseRequest): Promise<AuthenticateStudentUseCaseResponse> {
		const student = await this.studentsRepository.findByEmail(email);

		if (!student) {
			return left(new InvalidCredentialsException());
		}

		const hashedPassword = await this.hashComparer.compare(password, student.password);

		if (!hashedPassword) {
			return left(new InvalidCredentialsException());
		}

		const accessToken = await this.encrypter.encrypt({
			sub: student.id.toString(),
		});

		return right({
			accessToken,
		});
	}
}
