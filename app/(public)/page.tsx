import Categories from '@/components/Categories';
import TopicTeaser from '@/components/TopicTeaser';
import { prisma } from '@/lib/prisma';

export default async function Home() {
	const categories = await prisma.category.findMany({
		include: {
			_count: {
				select: { topics: true },
			},
		},
	});
	const topics = await prisma.topic.findMany({
		orderBy: { createdAt: 'desc' },
		include: {
			author: {
				select: { name: true },
			},
		},
	});

	return (
		<main className="default-layout">
			<h1>Projekt Forum</h1>
			<div>
				<div>
					<Categories categories={categories} />
				</div>
				<div>
					{topics.map((topic) => (
						<TopicTeaser key={topic.id} {...topic} />
					))}
				</div>
			</div>
		</main>
	);
}
