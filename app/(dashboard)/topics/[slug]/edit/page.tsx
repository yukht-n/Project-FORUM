import { notFound } from 'next/navigation';
import TopicForm from '@/components/TopicEdit/TopicForm';
import { prisma } from '@/lib/prisma';

type Props = PageProps<'/topics/[slug]/edit'>;
export default async function page({ params }: Props) {
	const { slug } = await params;
	const topic = await prisma.topic.findUnique({
		where: { slug },
	});
	if (!topic) notFound();

	const categories = await prisma.category.findMany();

	return (
		<>
			<header>
				<h1>Edit topic</h1>
			</header>

			<TopicForm categories={categories} initialData={topic} />
		</>
	);
}
