import Link from 'next/link';
import type { Categories as Category } from '@/types/category';

type Props = { categories: Category[] };
export default function Categories({ categories }: Props) {
	return (
		<div className="categories">
			{categories
				.filter((category) => category._count.topics)
				.map((category) => (
					<p key={category.id}>
						<Link href={`/category/${category.slug}`}>
							{category.name}
							{':'}
							<strong>{category._count.topics}</strong>{' '}
						</Link>
					</p>
				))}
		</div>
	);
}
