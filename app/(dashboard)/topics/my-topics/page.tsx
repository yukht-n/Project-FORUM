import { headers } from 'next/headers';
import { auth } from '@/auth';
import TopicList from '@/components/TopicEdit/TopicList';
import { prisma } from '@/lib/prisma';

export default async function MyTopicsPage() {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) return;
	const myTopics = await prisma.topic.findMany({
		where: { authorId: session.user.id },
		orderBy: { createdAt: 'desc' },
	});
	return (
		<>
			<h1>My Topics:</h1>
			<TopicList initialTopics={myTopics} />
		</>
	);
}
