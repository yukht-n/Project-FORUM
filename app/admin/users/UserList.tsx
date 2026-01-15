'use client';
import Image from 'next/image';
import { useTransition } from 'react';
import type { User } from '@/lib/generated/prisma/client';
import { updateUserRole } from './userActions';

type Props = { users: User[] };
export default function UserList({ users }: Props) {
	const [isPending, startTransition] = useTransition();

	const handleRoleChange = (userId: string, role: string) => {
		startTransition(async () => {
			await updateUserRole(userId, role);
		});
	};

	return (
		<div className="admin-container">
			<div className="user-list-header">
				<span>User</span>
				<span>Email</span>
				<span>Role</span>
				<span>Registered</span>
			</div>
			<ul className="user-list">
				{users.map((user) => (
					<li
						key={user.id}
						className={`user-card ${isPending ? 'user-card--pending' : ''}`}
					>
						<div className="user-info">
							{user.image ? (
								<Image
									src={user.image}
									alt={user.name}
									width={40}
									height={40}
									className="user-info__avatar"
								/>
							) : (
								<div className="user-info__avatar-placeholder">
									{user.name.charAt(0)}
								</div>
							)}
							<span className="user-info__name">{user.name}</span>
						</div>

						<div className="user-email">{user.email}</div>

						<div className="user-role">
							<select
								className="form-group__select user-role__select"
								defaultValue={user.role}
								onChange={(e) => handleRoleChange(user.id, e.target.value)}
								disabled={isPending}
							>
								<option value="USER">User</option>
								<option value="MODERATOR">Moderator</option>
								<option value="ADMIN">Admin</option>
							</select>
						</div>

						<div className="user-date">
							{new Date(user.createdAt).toLocaleDateString('de-DE')}
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
