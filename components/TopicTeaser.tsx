import Link from 'next/link';
import type { Topic } from '@/lib/generated/prisma/client';

type Props = Topic & {
	author?: {
		name: string;
	} | null;
	_count: {
		comments: number;
	};
};
export default function TopicTeaser({
	title,
	content,
	slug,
	author,
	createdAt,
	updatedAt,
	_count,
}: Props) {
	const cut = (text: string, length = 120) =>
		text.length > length ? `${text.slice(0, length)}...` : text;
	return (
		<article className="topic-teaser">
			<Link href={`/topics/${slug}`} className="topic-teaser__link">
				<h3 className="topic-teaser__title">{title}</h3>
				<p className="topic-teaser__content">{cut(content)}</p>
			</Link>

			<footer className="topic-teaser__footer">
				<div className="topic-teaser__meta">
					{author && (
						<div className="topic-teaser__group">
							<span className="topic-teaser__label">Author:</span>
							<span className="topic-teaser__value">{author.name}</span>
						</div>
					)}
					<div className="topic-teaser__group">
						<span className="topic-teaser__label">Created:</span>
						<span className="topic-teaser__value">
							{new Date(createdAt).toLocaleDateString('de-DE')}
						</span>
					</div>
					{_count.comments > 0 && (
						<div className="topic-teaser__commentar">
							<span className="topic-teaser__label">Comments:</span>
							<span className="topic-teaser__value">{_count.comments}</span>
						</div>
					)}
				</div>
			</footer>
		</article>
	);
}
