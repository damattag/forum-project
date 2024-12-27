/**
 * Make some properties optional on type
 *
 * @example
 * ```typescript
 * type Post = {
 *  id: number;
 *  title: string;
 *  slug: string;
 * }
 *
 * Optional<Post, 'slug' | 'id'> // { id?: number; title: string; slug?: string; }
 * ```
 **/

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
