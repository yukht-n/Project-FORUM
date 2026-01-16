'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { startTransition, useOptimistic } from 'react';
import type { Topic } from '@/lib/generated/prisma/client';
import { serverDeleteTopicAction } from './topicListActions';

type Props = { initialTopics: Topic[] };
export default function TopicList({ initialTopics }: Props) {
	const [optimisticTopics, optimisticTopicsDispatch] = useOptimistic(
		initialTopics,
		optimisticReducer,
	);
	const pathname = usePathname();
	console.log(pathname);

	const handleDeleteTopic = async (id: string) => {
		startTransition(async () =>
			optimisticTopicsDispatch({ action: 'delete', topicId: id }),
		);
		await serverDeleteTopicAction(id);
	};

	return (
		<ul>
			{optimisticTopics.map((topic) => (
				<li key={topic.id}>
					<Link href={`/topics/${topic.slug}`}>{topic.title}</Link>
					<Link
						href={`/topics/${topic.slug}/edit?returnTo=${pathname}`}
						className="btn-edit"
					>
						🖋️
					</Link>
					<button type="button" onClick={() => handleDeleteTopic(topic.id)}>
						🗑️
					</button>
				</li>
			))}
		</ul>
	);
}

function optimisticReducer(
	topics: Topic[],
	message: { action: 'delete'; topicId: string },
) {
	switch (message.action) {
		case 'delete':
			return topics.filter((topic) => topic.id !== message.topicId);
	}
}
