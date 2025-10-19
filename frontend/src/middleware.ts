import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { CLIENT_ROUTES } from '@/routes';
import { AUTH_ROUTES } from '@/routes/authRoutes';

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

  // Protected routes
  const protectedRoutes = [CLIENT_ROUTES.DASHBOARD, CLIENT_ROUTES.COURSES, CLIENT_ROUTES.PURCHASE];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

    // If trying to access protected route without token, redirect to home
    if (isProtectedRoute && !token) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Verify token with backend for protected routes
    if (isProtectedRoute && token) {
      try {
        const accessToken = (token as any)?.accessToken;
        if (!accessToken) {
          return NextResponse.redirect(new URL('/', req.url));
        }

        // Use centralized auth route for verifying token
        const response = await fetch(AUTH_ROUTES.ME, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          // Token is invalid, redirect to home
          return NextResponse.redirect(new URL('/', req.url));
        }
      } catch (error) {
        // Backend check failed, redirect to home
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // This callback is called before the middleware function
        // Return true to allow the middleware to run
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
    '/dashboard/:path*',
    '/courses/:path*',
    '/purchase/:path*',
  ],
};
