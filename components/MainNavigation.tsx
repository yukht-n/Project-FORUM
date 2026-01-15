import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { CgCloseO, CgMenuRound } from 'react-icons/cg';
import { useToggle } from '@/lib/hooks/useToggle';

/* 
Barrierefreies Menü:
https://inclusive-components.design/menus-menu-buttons/
*/

type LinkTarget = {
	text: string;
	url: `/${string}`;
	isPrivate?: boolean;
};
const linkTargets = [
	{ text: 'Create Topic', url: '/topics/create' },

	/* { text: 'Add Veranstaltung', url: '/veranstaltungen/neu', isPrivate: true }, */
] satisfies LinkTarget[];

type Props = {
	isLoggedIn?: boolean;
};
export default function MainNavigation({ isLoggedIn = false }: Props) {
	const [isOpen, toggleMenu, , , closeMenu] = useToggle(false);
	const pathname = usePathname();

	// biome-ignore lint/correctness/useExhaustiveDependencies: False alarm
	useEffect(closeMenu, [pathname]);

	return (
		<nav className="main-navigation" aria-label="Hauptmenü">
			<button
				className="main-navigation__button"
				type="button"
				onClick={toggleMenu}
			>
				Menü {isOpen ? <CgCloseO /> : <CgMenuRound />}
			</button>

			{isOpen && (
				<ul className="main-navigation__list">
					{getMenuItems(linkTargets, pathname, isLoggedIn)}
				</ul>
			)}
		</nav>
	);
}

function getMenuItems(
	linkTargets: LinkTarget[],
	pathname: string,
	isLoggedIn = false,
) {
	return linkTargets
		.filter(({ isPrivate }) => !isPrivate || isLoggedIn)
		.map(({ url, text }) => {
			const isCurrentPage = url === pathname;
			const cssClasses = `main-navigation__link ${isCurrentPage ? 'main-navigation__link--current' : ''}`;

			return (
				<li key={url}>
					<Link
						className={cssClasses}
						href={url}
						aria-current={isCurrentPage ? 'page' : undefined}
					>
						{text}
					</Link>
				</li>
			);
		});
}
