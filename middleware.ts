import { NextRequest, NextResponse } from 'next/server';
import { getSession } from './app/lib/actions/session';

const protectedRoutes = [
  '/worldcups/create',
  '/edit-user',
  '/worldcups/update',
  '/worldcups/users',
];
const publicRoutes = ['/signin', '/signup'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const session = await getSession();
  const isAuthenticated = session?.userId;

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/signin', req.nextUrl));
  }

  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/signout', req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
