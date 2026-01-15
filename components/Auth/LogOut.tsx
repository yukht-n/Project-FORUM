import { redirect } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

type Props = { path: string };
export default function LogOut({ path }: Props) {
	const handleClick = async () => {
		await authClient.signOut();
		redirect(path);
	};
	return (
		<button type="button" onClick={handleClick}>
			Abmelden
		</button>
	);
}
