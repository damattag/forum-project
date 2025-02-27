import { PaginationParams } from '@/core/repositories/pagination-params';

export interface GetPaginationOutput {
	skip?: number;
	take?: number;
}

export function getPagination(pagination: PaginationParams): GetPaginationOutput {
	const { page, limit } = pagination;

	return {
		...(page && limit && { skip: (page - 1) * limit }),
		...(limit && { take: limit }),
	};
}
