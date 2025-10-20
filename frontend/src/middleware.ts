import { withAuth } from 'next-auth/middleware';
import { NextResponse, NextRequest } from 'next/server';
import { CLIENT_ROUTES } from '@/routes';
import { AUTH_ROUTES } from '@/routes/authRoutes';

export default withAuth(
  async function middleware(req: NextRequest & { nextauth?: { token?: unknown } }) {
    const pathname = req.nextUrl.pathname;
    const token = req.nextauth?.token as unknown;

    const authRoutes = ['/', '/register'];
    const isAuthRoute = authRoutes.includes(pathname);

    const protectedRoutes = [CLIENT_ROUTES.DASHBOARD, CLIENT_ROUTES.COURSES, CLIENT_ROUTES.PURCHASE, CLIENT_ROUTES.MY_COURSES];
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

    if (isAuthRoute && token) {
      try {
        const accessToken = typeof token === 'object' && token !== null && 'accessToken' in (token as object)
          ? (token as { accessToken?: string }).accessToken
          : undefined;
        if (accessToken) {
          const response = await fetch(AUTH_ROUTES.ME, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (response.ok) {
            return NextResponse.redirect(new URL(CLIENT_ROUTES.DASHBOARD, req.url));
          }
        }
      } catch {
        console.error('Token verification failed');
      }
    }

    if (isProtectedRoute && !token) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    if (isProtectedRoute && token) {
      try {
        const accessToken = typeof token === 'object' && token !== null && 'accessToken' in (token as object)
          ? (token as { accessToken?: string }).accessToken
          : undefined;
        if (!accessToken) {
          return NextResponse.redirect(new URL('/', req.url));
        }

        const response = await fetch(AUTH_ROUTES.ME, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          return NextResponse.redirect(new URL('/', req.url));
        }
      } catch {
        return NextResponse.redirect(new URL('/', req.url));
      }
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
  ],
};
