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

/* ADD */
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

/* DELETE */
export async function serverDeleteCommentAction(id: string) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (!session) return false;

	const isModerator =
		session.user.role === 'MODERATOR' || session.user.role === 'ADMIN';
	const searchParam = isModerator ? { id } : { id, authorId: session.user.id };

	try {
		const deletedComment = await prisma.comment.delete({
			where: searchParam,
			include: { topic: { select: { slug: true } } },
		});
		revalidatePath(`/topics/${deletedComment.topic.slug}`);
	} catch (error) {
		console.log(error);
		return false;
	}
}

/* UPDATE */
export async function serverUpdateCommentAction(
	id: string,
	newContent: string,
) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (!session) return false;

	const isModerator =
		session.user.role === 'MODERATOR' || session.user.role === 'ADMIN';
	const searchParam = isModerator ? { id } : { id, authorId: session.user.id };

	try {
		const updateComment = await prisma.comment.update({
			where: searchParam,
			data: { content: newContent },
			include: { topic: { select: { slug: true } } },
		});
		revalidatePath(`/topics/${updateComment.topic.slug}`);
	} catch (error) {
		console.log(error);
		return false;
	}
}
