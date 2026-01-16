import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Comments from '@/components/Comment/Comments';
import { prisma } from '@/lib/prisma';

type Props = PageProps<'/topics/[slug]'>;

export default async function TopicPage({ params }: Props) {
	const { slug } = await params;

	//Topic searching
	const topic = await prisma.topic.findUnique({
		where: { slug },
		include: {
			author: {
				select: { name: true, image: true },
			},
			category: true,
			comments: {
				include: {
					author: { select: { name: true, image: true } },
				},
				orderBy: { createdAt: 'desc' },
			},
		},
	});

	//If the topic is not found
	if (!topic) {
		notFound();
	}

	//This logic goes to the client to partially cache the page.
	/* 	const session = await auth.api.getSession({
		headers: await headers(), // you need to pass the headers object.
	});
	const activeUser = session
		? { name: session.user.name, image: session.user.image }
		: null; */

	return (
		<main className="topic">
			<nav className="topic__nav">
				<Link href="/">Home</Link>
				<span>/</span>
				<Link href={`/category/${topic.category.slug}`}>
					{topic.category.name}
				</Link>
			</nav>

			<article className="topic__article">
				<header>
					<h1 className="topic__title">{topic.title}</h1>

					<div className="topic__meta">
						{topic.author ? (
							<div className="topic__author-info">
								{topic.author.image && (
									<Image
										src={topic.author.image}
										alt={`${topic.author.name} avatar`}
										width={40}
										height={40}
										className="topic__avatar"
									/>
								)}
								<span className="topic__author-name">{topic.author.name}</span>
							</div>
						) : (
							<span className="topic__author-deleted">User deleted</span>
						)}
						<span>•</span>
						<time className="topic__date">
							{new Date(topic.createdAt).toLocaleString('de-DE', {
								day: '2-digit',
								month: '2-digit',
								year: 'numeric',
							})}
						</time>
					</div>
				</header>

				<div className="topic__content">{topic.content}</div>
			</article>

			<section className="topic__comments-section">
				<h3 className="topic__comments-title">
					{topic.comments.length > 0
						? `Comments: ${topic.comments.length}`
						: 'Start a discussion'}
				</h3>
				<Comments
					topicId={topic.id}
					initialComments={topic.comments}
					//This logic goes to the client to partially cache the page.
					/* author={activeUser} */
					topicSlug={slug}
				/>
			</section>
		</main>
	);
}
