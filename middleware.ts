import { getSessionCookie } from 'better-auth/cookies';
import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
	const sessionCookie = getSessionCookie(request);
	// THIS IS NOT SECURE!
	// This is the recommended approach to optimistically redirect users
	// We recommend handling auth checks in each page/route
	if (!sessionCookie) {
		const url = new URL('/sign-in', request.url);
		url.searchParams.set('returnTo', request.nextUrl.pathname);
		return NextResponse.redirect(url);
	}
	return NextResponse.next();
}

export const config = {
	matcher: ['/topics/create', '/settings/:path*', '/admin/:path*'], // Specify the routes the middleware applies to
};
