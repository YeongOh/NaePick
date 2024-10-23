import { NextRequest, NextResponse } from 'next/server';
import { getSession } from './app/lib/actions/session';

const protectedRoutes = [
  '/worldcups/create',
  '/edit-user',
  '/update-info',
  '/update-candidates',
  '/worldcups/users',
];
const publicRoutes = ['/signin', '/signup'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some(
    (publicRoute) =>
      publicRoute === path ||
      path.endsWith(publicRoute) ||
      path.startsWith(publicRoute)
  ); // 다이나믹 path 때문에 이런식으로 확인
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
