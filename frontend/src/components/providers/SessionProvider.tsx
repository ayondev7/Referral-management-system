'use client';

import { SessionProvider as NextAuthSessionProvider, useSession, signOut } from 'next-auth/react';
import { ReactNode, useEffect } from 'react';

function SessionErrorHandler({ children }: { children: ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      signOut({ callbackUrl: '/', redirect: true });
    }
  }, [session]);

  return <>{children}</>;
}

function SessionProvider({ children }: { children: ReactNode }) {
  return (
    <NextAuthSessionProvider refetchInterval={15 * 60} refetchOnWindowFocus={true}>
      <SessionErrorHandler>
        {children}
      </SessionErrorHandler>
    </NextAuthSessionProvider>
  );
}

export default SessionProvider;
