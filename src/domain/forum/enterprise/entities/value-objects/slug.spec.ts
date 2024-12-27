import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import { expect, test } from 'vitest';

test('it should be able to create a slug from a text', () => {
	const slug = Slug.createFromText('Hello World');

	expect(slug.value).toBe('hello-world');
});
