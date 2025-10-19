import NextAuth, { NextAuthOptions, User as NextAuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import axios from 'axios';
import { BASE_URL } from '@/routes';

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

declare module 'next-auth' {
  interface Session {
    user: BackendUser;
    accessToken: string;
    refreshToken: string;
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
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please provide email and password');
        }

        try {
          const response = await axios.post<BackendAuthResponse>(
            `${BASE_URL}/api/users/login`,
            {
              email: credentials.email,
              password: credentials.password,
            }
          );

          const { user, accessToken, refreshToken } = response.data;

          return {
            ...user,
            accessToken,
            refreshToken,
          } as NextAuthUser;
        } catch (error: any) {
          const message = error.response?.data?.message || 'Login failed';
          throw new Error(message);
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      // Initial sign in
      if (user) {
        const authUser = user as any;
        token.user = {
          id: authUser.id,
          name: authUser.name,
          email: authUser.email,
          referralCode: authUser.referralCode,
          credits: authUser.credits,
        };
        token.accessToken = authUser.accessToken;
        token.refreshToken = authUser.refreshToken;
      }

      // Check if access token needs refresh (you can add expiry check here)
      // For now, we'll use the token as is
      
      return token;
    },
    async session({ session, token }) {
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
