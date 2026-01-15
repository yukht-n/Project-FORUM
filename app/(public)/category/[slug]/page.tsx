import { notFound } from 'next/navigation';
import TopicTeaser from '@/components/TopicTeaser';
import { prisma } from '@/lib/prisma';

type Props = PageProps<'/category/[slug]'>;
export default async function CategoryPage({ params }: Props) {
	const { slug } = await params;
	const topics = await prisma.category.findUnique({
		where: { slug: slug },
		include: {
			topics: {
				orderBy: { createdAt: 'desc' },
				include: {
					author: {
						select: { name: true, image: true },
					},
				},
			},
		},
	});
	if (!topics) {
		notFound();
	}

	return (
		<main className="topic">
			<article className="topic__article">
				<header>
					<h1 className="topic__title">Category: {topics.name}</h1>
				</header>
				<div>
					{topics.topics.map((topic) => (
						<TopicTeaser key={topic.id} {...topic} />
					))}
				</div>
			</article>
		</main>
	);
}
