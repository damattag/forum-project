import type { StudentsRepository } from '@/domain/forum/application/repositories/students.repository';
import type { Student } from '@/domain/forum/enterprise/entities/student.entity';

export class InMemoryStudentsRepository implements StudentsRepository {
	public items: Student[] = [];

	async findByEmail(email: string): Promise<Student | null> {
		const student = this.items.find((student) => student.email === email);

		if (!student) {
			return null;
		}

		return student;
	}

	async create(student: Student): Promise<void> {
		this.items.push(student);
	}
}
