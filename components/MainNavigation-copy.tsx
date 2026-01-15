import { AnimatePresence, motion, stagger } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { CgCloseO, CgMenuRound } from 'react-icons/cg';
import { useToggle } from '@/lib/hooks/useToggle';

/* 
Barrierefreies Menü:
https://inclusive-components.design/menus-menu-buttons/
*/

const MotionLink = motion.create(Link);

type LinkTarget = {
	text: string;
	url: `/${string}`;
	isPrivate?: boolean;
};
const linkTargets = [
	{ text: 'Startseite', url: '/' },

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

	const listVariants = {
		closed: { opacity: 0, scaleY: 0 },
		open: { opacity: 1, scaleY: 1 },
	};

	return (
		<nav className="main-navigation" aria-label="Hauptmenü">
			<button
				className="main-navigation__button"
				type="button"
				onClick={toggleMenu}
			>
				Menü {isOpen ? <CgCloseO /> : <CgMenuRound />}
			</button>
			<AnimatePresence>
				{isOpen && (
					<motion.ul
						className="main-navigation__list"
						variants={listVariants}
						initial="closed"
						animate="open"
						exit="closed"
						transition={{
							delayChildren: stagger(0.1),
						}}
					>
						{getMenuItems(linkTargets, pathname, isLoggedIn)}
					</motion.ul>
				)}
			</AnimatePresence>
		</nav>
	);
}

function getMenuItems(
	linkTargets: LinkTarget[],
	pathname: string,
	isLoggedIn = false,
) {
	const listItemVariants = {
		closed: { opacity: 0, x: -100 },
		open: { opacity: 1, x: 0 },
	};

	return linkTargets
		.filter(({ isPrivate }) => !isPrivate || isLoggedIn)
		.map(({ url, text }) => {
			const isCurrentPage = url === pathname;
			const cssClasses = `main-navigation__link ${isCurrentPage ? 'main-navigation__link--current' : ''}`;

			return (
				<motion.li key={url} variants={listItemVariants}>
					<MotionLink
						className={cssClasses}
						href={url}
						aria-current={isCurrentPage ? 'page' : undefined}
						whileHover={{ scale: 1.1 }}
						whileFocus={{ scale: 1.1 }}
						transition={{ duration: 0.05 }}
					>
						{text}
					</MotionLink>
				</motion.li>
			);
		});
}
