'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TbAtom } from 'react-icons/tb';

export default function Header() {
	// Gibt den aktuellen Pfad ab der Domain zurück, z.B. "/" für die Startseite
	const pathname = usePathname();

	const isHomePage = pathname === '/';

	return (
		<header className="site-header">
			{isHomePage ? (
				<div className="site-header__title">
					<LogoContent />
				</div>
			) : (
				<Link className="site-header__title" href="/">
					<LogoContent />
				</Link>
			)}
		</header>
	);
}

function LogoContent() {
	return (
		<>
			<TbAtom /> Next
		</>
	);
}
