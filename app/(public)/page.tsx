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
			_count: { select: { comments: true } },
		},
	});

	return (
		<main className="sidebar-layout">
			<section className="site-content">
				<header className="home-header">
					<h1 className="home-header__title">Project FORUM</h1>
					<p className="home-header__desc">
						Discuss, share experiences, and ask questions.
					</p>
				</header>

				<div className="topic-feed">
					<h2 className="section-title">Last Topics</h2>
					{topics.map((topic) => (
						<TopicTeaser key={topic.id} {...topic} />
					))}
				</div>
			</section>
			{/* Side */}
			<aside className="sidebar-layout__sidebar">
				<div className="sidebar-block">
					<h2 className="sidebar-block__title">Categories</h2>
					<Categories categories={categories} />
				</div>

				<div className="sidebar-block stats">
					<h3 className="sidebar-block__title">Statistik</h3>
					<p>
						Forum topics: <strong>{topics.length}</strong>
					</p>
				</div>
			</aside>
		</main>
	);
}
