'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function serverDeleteTopicAction(id: string) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) throw Error('You should be logged-in');
	const isModerator =
		session.user.role === 'MODERATOR' || session.user.role === 'ADMIN';
	const searchParam = isModerator ? { id } : { id, authorId: session.user.id };

	try {
		const deletedTopic = await prisma.topic.delete({
			where: searchParam,
			include: { category: { select: { name: true } } },
		});

		revalidatePath(`category/${deletedTopic.category}`);
		revalidatePath('/');
		revalidatePath('/topics/my-topics');
	} catch (error) {
		console.log(error);
		return false;
	}
}
