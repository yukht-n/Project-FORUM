import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth.api.getSession({
		headers: await headers(), // you need to pass the headers object.
	});

	// If not logged in
	if (!session) {
		redirect('/');
	}

	return <main className="default-layout">{children}</main>;
}
