import { FakeHasher } from 'test/cryptography/fake-hasher';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students.repository';
import { RegisterStudentUseCase } from './register-student.usecase';

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let fakeHasher: FakeHasher;
let sut: RegisterStudentUseCase;

describe('Register Student', () => {
	beforeEach(() => {
		inMemoryStudentsRepository = new InMemoryStudentsRepository();
		fakeHasher = new FakeHasher();

		sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakeHasher);
	});

	it('should be able to register a student', async () => {
		const result = await sut.execute({
			email: 'john.doe@example.com',
			name: 'John Doe',
			password: '123456',
		});

		expect(result.isRight()).toBe(true);
		expect(result.value).toEqual({
			student: expect.objectContaining({
				email: 'john.doe@example.com',
				name: 'John Doe',
				password: '123456-hashed',
			}),
		});
	});

	it('should hash student password upon registration', async () => {
		const result = await sut.execute({
			email: 'john.doe@example.com',
			name: 'John Doe',
			password: '123456',
		});

		const hashedPassword = await fakeHasher.hash('123456');

		expect(result.isRight()).toBe(true);
		expect(inMemoryStudentsRepository.items[0].password).toEqual(hashedPassword);
	});
});
