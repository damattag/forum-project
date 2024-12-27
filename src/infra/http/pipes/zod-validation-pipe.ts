import { BadRequestException, type PipeTransform } from '@nestjs/common';
import { ZodError, type ZodObject } from 'zod';

export class ZodValidationPipe implements PipeTransform {
	constructor(private schema: ZodObject<any>) {}

	transform(value: unknown) {
		try {
			return this.schema.parse(value);
		} catch (error) {
			if (error instanceof ZodError) {
				throw new BadRequestException(
					error.issues.map((issue) => issue.message).join(', '),
				);
			}
		}

		return value;
	}
}
