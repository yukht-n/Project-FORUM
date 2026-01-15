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
	allowedRoles?: string[];
};
const linkTargets = [
	{
		text: 'Create Topic',
		url: '/topics/create',
		allowedRoles: ['USER', 'MODERATOR', 'ADMIN'],
	},
	{
		text: 'My Topics',
		url: '/topics/my-topics',
		allowedRoles: ['USER', 'MODERATOR', 'ADMIN'],
	},
	{
		text: 'Manage all Topics ',
		url: '/topics',
		allowedRoles: ['MODERATOR', 'ADMIN'],
	},
	{
		text: 'Manage Users ',
		url: '/admin/users',
		allowedRoles: ['ADMIN'],
	},

	/* { text: 'Add Veranstaltung', url: '/veranstaltungen/neu', isPrivate: true }, */
] satisfies LinkTarget[];

type Props = {
	isLoggedIn?: boolean;
	userRole: string | undefined;
};
export default function MainNavigation({
	isLoggedIn = false,
	userRole,
}: Props) {
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
					{getMenuItems(linkTargets, pathname, userRole)}
				</ul>
			)}
		</nav>
	);
}

function getMenuItems(
	linkTargets: LinkTarget[],
	pathname: string,
	userRole: string | undefined,
) {
	return linkTargets
		.filter(({ allowedRoles }) => userRole && allowedRoles?.includes(userRole))
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
