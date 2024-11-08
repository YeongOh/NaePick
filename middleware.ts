import { NextRequest, NextResponse } from 'next/server';
import { getSession } from './app/lib/session';

const protectedRoutes = ['/woc/create', '/edit', '/edit-candidates', '/wc/users'];
const publicRoutes = ['/auth/login', '/auth/signup'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some(
    (publicRoute) => publicRoute === path || path.endsWith(publicRoute) || path.startsWith(publicRoute)
  ); // 다이나믹 path 때문에 이런식으로 확인
  const isPublicRoute = publicRoutes.includes(path);

  const session = await getSession();
  const isAuthenticated = session?.userId;

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/auth/login', req.nextUrl));
  }

  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/auth/signout', req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
