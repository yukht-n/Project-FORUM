import { FaGithub } from 'react-icons/fa';
import { authClient } from '@/lib/auth-client';

type Props = {
	path: string;
};
export default function LogIn({ path }: Props) {
	return (
		<button
			className="btn-auth btn-auth--login"
			type="button"
			onClick={() =>
				authClient.signIn.social({
					provider: 'github',
					callbackURL: path,
				})
			}
		>
			Login <FaGithub />
		</button>
	);
}
