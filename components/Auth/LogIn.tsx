import { FaGithub } from 'react-icons/fa';
import { authClient } from '@/lib/auth-client';

export default function LogIn() {
    return (
        <button
            className="btn-auth btn-auth--login"
            type="button"
            onClick={() => authClient.signIn.social({ provider: 'github' })}
        >
            Login <FaGithub />
        </button>
    );
}
