import { withAuth } from 'next-auth/middleware';
import { NextResponse, NextRequest } from 'next/server';
import { CLIENT_ROUTES } from '@/routes';

export default withAuth(
  async function middleware(req: NextRequest & { nextauth?: { token?: unknown } }) {
    const pathname = req.nextUrl.pathname;
    const token = req.nextauth?.token as unknown;

    const authRoutes = ['/', '/register'];
    const isAuthRoute = authRoutes.includes(pathname);

    const protectedRoutes = [CLIENT_ROUTES.DASHBOARD, CLIENT_ROUTES.COURSES, CLIENT_ROUTES.PURCHASE, CLIENT_ROUTES.MY_COURSES, CLIENT_ROUTES.MANAGE_REFERRALS];
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

    if (isAuthRoute && token) {
      return NextResponse.redirect(new URL(CLIENT_ROUTES.DASHBOARD, req.url));
    }

    if (isProtectedRoute && !token) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => {
        return true;
      },
    },
    pages: {
      signIn: '/',
    },
  }
);

export const config = {
  matcher: [
    '/',
    '/register',
    '/dashboard/:path*',
    '/courses/:path*',
    '/purchase/:path*',
    '/my-courses/:path*',
    '/manage-referrals/:path*',
  ],
};
