import { headers } from 'next/headers';
import { auth } from '@/auth';
import TopicList from '@/components/TopicEditList/TopicList';
import { prisma } from '@/lib/prisma';

export default async function MyTopicsPage() {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!(session?.user.role === 'MODERATOR' || session?.user.role === 'ADMIN'))
		return;
	const myTopics = await prisma.topic.findMany({
		orderBy: { createdAt: 'desc' },
	});
	return (
		<>
			<h1>Topics:</h1>
			<TopicList initialTopics={myTopics} />
		</>
	);
}
