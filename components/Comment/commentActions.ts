'use server';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

type Data = {
	content: string;
	topicId: string;
	parentId?: string | null;
};
export async function serverAddCommentAction(data: Data, topicSlug: string) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (!session) return false;

	try {
		const addedComment = await prisma.comment.create({
			data: { authorId: session.user.id, ...data },
		});
		revalidatePath(`/topics/${topicSlug}`);
		return addedComment;
	} catch (error) {
		console.log(error);
		return false;
	}
}
