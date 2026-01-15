'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity } from 'react';
import { TbAtom } from 'react-icons/tb';
import { authClient } from '@/lib/auth-client';
import LogIn from './Auth/LogIn';
import LogOut from './Auth/LogOut';
import User from './Auth/User';
import MainNavigation from './MainNavigation';

export default function Header() {
	// Gibt den aktuellen Pfad ab der Domain zurück, z.B. "/" für die Startseite
	const pathname = usePathname();

	const isHomePage = pathname === '/';

	const { data: session, isPending } = authClient.useSession();

	const isLoggedIn = !!session;

	return (
		<header className="site-header">
			<div className="site-header__inner">
				{isHomePage ? (
					<div className="site-header__logo">
						<LogoContent />
					</div>
				) : (
					<Link className="site-header__logo" href="/">
						<LogoContent />
					</Link>
				)}

				<div className="site-header__right">
					<div className="site-header__auth">
						{isPending ? (
							<div className="site-header__loader" />
						) : session ? (
							<div className="site-header__user-zone">
								<User {...session.user} />
								<LogOut path={pathname} />
							</div>
						) : (
							<LogIn path={pathname} />
						)}
					</div>
					<Activity mode={isLoggedIn ? 'visible' : 'hidden'}>
						<MainNavigation isLoggedIn={isLoggedIn} />
					</Activity>
				</div>
			</div>
		</header>
	);
}

function LogoContent() {
	return (
		<>
			<TbAtom className="site-header__logo-icon" />
			<span className="site-header__logo-text">F-Community</span>
		</>
	);
}
