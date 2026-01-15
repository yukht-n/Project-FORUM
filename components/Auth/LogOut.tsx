import { authClient } from '@/lib/auth-client';

export default function LogOut() {
	return (
		<button type="button" onClick={async () => await authClient.signOut()}>
			Abmelden
		</button>
	);
}
