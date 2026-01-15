import type { Category } from '@/lib/generated/prisma/client';

export type Categories = Category & {
	_count: {
		topics: number;
	};
};
