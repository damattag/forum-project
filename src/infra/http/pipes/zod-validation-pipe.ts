import { BadRequestException, type PipeTransform } from '@nestjs/common';
import { ZodError, type ZodObject } from 'zod';

export class ZodValidationPipe implements PipeTransform {
	constructor(private schema: ZodObject<any>) {}

	transform(value: unknown) {
		try {
			return this.schema.parse(value);
		} catch (error) {
			if (error instanceof ZodError) {
				let message = '';

				for (const issue of error.issues) {
					message += `${issue.path.join('.')}: ${issue.message}\n`;
				}

				throw new BadRequestException(message);
			}
		}

		return value;
	}
}
