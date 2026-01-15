import { prisma } from '@/lib/prisma';
import TopicForm from './TopicForm';

export default async function CreateTopicPage() {
	const categories = await prisma.category.findMany({
		orderBy: { name: 'asc' },
	});

	return (
		<>
			<header>
				<h1>Create new topic</h1>
				<p>Share your thoughts or ask the community for advice</p>
			</header>

			<TopicForm categories={categories} />
		</>
	);
}
