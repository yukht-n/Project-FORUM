import { prisma } from '../lib/prisma';

async function main() {
	console.log('Start filling DB...');

	// 1. Creating categories
	const categories = [
		{
			name: 'React',
			slug: 'react',
			description: 'Alles über die React-Bibliothek und ihr Ökosystem',
		},
		{
			name: 'Next.js',
			slug: 'next-js',
			description:
				'Diskussion über das Next.js-Framework und Serverkomponenten',
		},
		{
			name: 'Prisma & DB',
			slug: 'prisma-db',
			description: 'Arbeiten mit Datenbanken, ORM und NeonDB',
		},
		{
			name: 'Better-auth',
			slug: 'auth',
			description: 'Authentifizierungs- und Sicherheitsprobleme',
		},
	];

	for (const cat of categories) {
		await prisma.category.upsert({
			where: { slug: cat.slug },
			update: {},
			create: cat,
		});
	}

	console.log(`${categories.length} categories ware created.`);

	// 2. Creating a test system user
	const systemUser = await prisma.user.upsert({
		where: { email: 'system@forum.com' },
		update: {},
		create: {
			id: 'system-user-id',
			name: 'Administrator',
			email: 'system@forum.com',
			role: 'ADMIN',
		},
	});

	// 3. Creating a test Topic
	await prisma.topic.upsert({
		where: { slug: 'welcome-to-the-forum' },
		update: {},
		create: {
			title: 'Welcome to our new forum!',
			slug: 'welcome-to-the-forum',
			content:
				'This is the first post created automatically to test the database structure.',
			authorId: systemUser.id,
			categoryId: (await prisma.category.findFirst({
				where: { slug: 'next-js' },
			}))!.id,
		},
	});

	console.log('The database has been successfully filled with test data.');
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
