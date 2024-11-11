import { NextRequest, NextResponse } from 'next/server';
import { getSession } from './app/lib/session';

const protectedRoutes = ['/wc/create', '/wc/edit', '/wc/edit-candidates', '/wc/users'];
const publicOnlyRoutes = ['/auth/login', '/auth/signup'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.includes(path);
  if (isProtectedRoute) {
    const session = await getSession();
    if (!session?.userId) return NextResponse.redirect(new URL('/auth/login', req.nextUrl));
  }

  const isPublicOnlyRoute = publicOnlyRoutes.includes(path);
  if (isPublicOnlyRoute) {
    const session = await getSession();
    if (session?.userId) return NextResponse.redirect(new URL('/auth/signout', req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
