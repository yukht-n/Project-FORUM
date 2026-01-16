import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
// If your Prisma file is located elsewhere, you can change the path
/* import { PrismaClient } from '@/lib/generated/prisma/client'; */
import { prisma } from './lib/prisma';

/* const prisma = new PrismaClient(); */
export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: 'postgresql', // or "mysql", "postgresql", ...etc
	}),
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		github: {
			clientId: process.env.GITHUB_CLIENT_ID as string,
			clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
		},
	},
	trustedOrigins: [
		process.env.NEXT_PUBLIC_APP_URL as string,
		'https://project-forum.vercel.app/',
	],
	user: {
		additionalFields: {
			role: {
				type: 'string',
				defaultValue: 'USER',
				input: false,
			},
		},
	},
});
export type Session = typeof auth.$Infer.Session;
