import Link from 'next/link';
import type { Categories as Category } from '@/types/category';

type Props = { categories: Category[] };
export default function Categories({ categories }: Props) {
	return (
		<div className="categories">
			{categories.map((category) => (
				<Link key={category.id} href={`/category/${category.slug}`}>
					<div>
						<p>
							{category.name}{' '}
							<span>
								{category._count.topics}{' '}
								{category._count.topics === 1 ? 'topic' : 'topics'}
							</span>{' '}
						</p>
					</div>
				</Link>
			))}
		</div>
	);
}
