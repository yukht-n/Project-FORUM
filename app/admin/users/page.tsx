import { prisma } from '@/lib/prisma';
import UserList from './UserList';

export default async function AdminUsersPage() {
	const users = await prisma.user.findMany({
		orderBy: { createdAt: 'desc' },
	});

	return (
		<>
			<header className="page-header">
				<h1 className="page-header__title">Users</h1>
				<p className="page-header__subtitle">Registered: {users.length}</p>
			</header>

			<div className="admin-card">
				<UserList users={users} />
			</div>
		</>
	);
}
