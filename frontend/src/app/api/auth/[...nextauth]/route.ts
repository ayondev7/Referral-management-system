import NextAuth, { NextAuthOptions, User as NextAuthUser, Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import { AUTH_ROUTES } from '@/routes/authRoutes';

interface BackendUser {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  credits: number;
}

interface BackendAuthResponse {
  user: BackendUser;
  accessToken: string;
  refreshToken: string;
}

type AuthUser = BackendUser & { accessToken: string; refreshToken: string };

declare module 'next-auth' {
  interface Session {
    user: BackendUser;
    accessToken: string;
    refreshToken: string;
    error?: string;
  }

  interface User extends BackendUser {
    accessToken: string;
    refreshToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: BackendUser;
    accessToken: string;
    refreshToken: string;
    accessTokenExpiry: number;
    error?: string;
  }
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await axios.post(AUTH_ROUTES.REFRESH, {
      refreshToken: token.refreshToken,
    });

    return {
      ...token,
      accessToken: response.data.accessToken,
      accessTokenExpiry: Date.now() + 3 * 60 * 60 * 1000,
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    } as JWT;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        name: { label: 'Name', type: 'text' },
        referralCode: { label: 'Referral Code', type: 'text' },
        isRegistration: { label: 'Is Registration', type: 'text' },
        isGuestLogin: { label: 'Is Guest Login', type: 'text' },
      },
      async authorize(credentials) {
        try {
          let response;

          if (credentials?.isGuestLogin === 'true') {
            response = await axios.post<BackendAuthResponse>(AUTH_ROUTES.GUEST_LOGIN);
          } else if (credentials?.isRegistration === 'true') {
            const registerData: any = {
              name: credentials.name,
              email: credentials.email,
              password: credentials.password,
            };
            
            if (credentials.referralCode) {
              registerData.referralCode = credentials.referralCode;
            }
            
            await axios.post(AUTH_ROUTES.REGISTER, registerData);
            
            response = await axios.post<BackendAuthResponse>(
              AUTH_ROUTES.LOGIN,
              {
                email: credentials.email,
                password: credentials.password,
              }
            );
          } else {
            if (!credentials?.email || !credentials?.password) {
              throw new Error('Please provide email and password');
            }

            response = await axios.post<BackendAuthResponse>(
              AUTH_ROUTES.LOGIN,
              {
                email: credentials.email,
                password: credentials.password,
              }
            );
          }

          const { user, accessToken, refreshToken } = response.data;

          return {
            ...user,
            accessToken,
            refreshToken,
          } as NextAuthUser;
        } catch (err) {
          const errorObj = err as { response?: { data?: { message?: string }; statusText?: string } };
          const message = errorObj.response?.data?.message || errorObj.response?.statusText || 'Authentication failed';
          throw new Error(message);
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60,
  },
  callbacks: {
  async jwt({ token, user }: { token: JWT; user?: unknown }): Promise<JWT> {
      if (user) {
        const authUser = user as AuthUser;
        token.user = {
          id: authUser.id,
          name: authUser.name,
          email: authUser.email,
          referralCode: authUser.referralCode,
          credits: authUser.credits,
        };
        token.accessToken = authUser.accessToken;
        token.refreshToken = authUser.refreshToken;
        token.accessTokenExpiry = Date.now() + 3 * 60 * 60 * 1000;
        return token;
      }

      const shouldRefresh = (token.accessTokenExpiry as number) < Date.now() + 30 * 60 * 1000;
      
      if (shouldRefresh) {
        console.log('Refreshing access token...');
        return await refreshAccessToken(token);
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token.error === 'RefreshAccessTokenError') {
        return { ...session, error: 'RefreshAccessTokenError' } as Session;
      }

      session.user = token.user;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
