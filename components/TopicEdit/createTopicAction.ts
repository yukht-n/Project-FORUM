'use server';

import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import slugify from 'slug';
import z from 'zod';
import { zfd } from 'zod-form-data';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

const TopicSchema = zfd.formData(
	z.object({
		title: z
			.string()
			.min(5, 'The title must be at least 5 characters long')
			.max(100, 'The title must be maximum 100 characters long.'),
		content: z
			.string()
			.min(20, 'Write minimum 20 characters')
			.max(10000, 'Oh, its to long.'),
		categoryId: z.string().min(1, 'Choose a category'),
	}),
);

export async function createTopic(formState: unknown, formData: FormData) {
	const session = await auth.api.getSession({
		headers: await headers(), // you need to pass the headers object.
	});
	if (!session)
		return {
			message: `createTopic was called without active session.`,
			status: 'error',
		};
	const result = TopicSchema.safeParse(formData);

	if (!result.success)
		return {
			message: `Validation failed: ${z.prettifyError(result.error)}`,
			status: 'error',
		};
	const { title, content, categoryId } = result.data;

	const slug = `${slugify(title)}-${randomUUID().slice(-4)}`;

	try {
		await prisma.topic.create({
			data: {
				title,
				content,
				categoryId,
				slug,
				authorId: session.user.id,
			},
		});

		/* return {
			message: 'Success',
			status: 'success',
			newTopicSlug: topic.slug,
		}; */

		//Cache clearing . revalidateTag ?
		revalidatePath('/');
		revalidatePath(`/category/${categoryId}`);
	} catch (error) {
		console.log(error);
		return {
			message: 'SQL Error',
			status: 'error',
		};
	}
	redirect(`/topics/${slug}`);
}

export async function updateTopic(
	id: string,
	formState: unknown,
	formData: FormData,
) {
	const session = await auth.api.getSession({
		headers: await headers(), // you need to pass the headers object.
	});
	if (!session)
		return {
			message: `updateTopic was called without active session.`,
			status: 'error',
		};

	const result = TopicSchema.safeParse(formData);

	if (!result.success)
		return {
			message: `Validation failed: ${z.prettifyError(result.error)}`,
			status: 'error',
		};

	try {
		await prisma.topic.update({
			where: { id },
			data: result.data,
		});

		/* return {
			message: 'Success',
			status: 'success',
			newTopicSlug: topic.slug,
		}; */

		//Cache clearing . revalidateTag ?
		revalidatePath('/');
		revalidatePath(`/category/${result.data.categoryId}`);
	} catch (error) {
		console.log(error);
		return {
			message: 'SQL Error',
			status: 'error',
		};
	}
	redirect(`/topics/my-topics`);
}
