'use server';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import z from 'zod';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

const RoleSchema = z.literal(['USER', 'ADMIN', 'MODERATOR']);
export async function updateUserRole(userId: string, newRole: string) {
	const session = await auth.api.getSession({ headers: await headers() });

	if (session?.user.role !== 'ADMIN') {
		throw new Error('Forbidden: Only admins can change users');
	}
	const result = RoleSchema.safeParse(newRole);
	if (!result.success) throw new Error(result.error.message);

	await prisma.user.update({
		where: { id: userId },
		data: { role: result.data },
	});

	revalidatePath('/admin/users');
}
