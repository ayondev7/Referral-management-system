 'use client';
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useUser } from '@/hooks/userHooks';
import Image from 'next/image';
import { LuMenu } from 'react-icons/lu';
import Button from '@components/ui/Button';
import Sidebar from '@components/shared/Sidebar';
import { CLIENT_ROUTES } from '@/routes';
import { NAV_LINKS } from '@/config/navConfig';

const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { status } = useSession();
  const { data: user } = useUser();
  const [loggingOut, setLoggingOut] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAuthenticated = status === 'authenticated';

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await signOut({ redirect: true, callbackUrl: CLIENT_ROUTES.HOME });
    } catch {
      try {
        await signOut({ redirect: false });
      } finally {
        router.push(CLIENT_ROUTES.HOME);
      }
    } finally {
      setLoggingOut(false);
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userName={user?.name}
        userCredits={user?.credits}
        onLogout={handleLogout}
        loggingOut={loggingOut}
      />

      <header className="bg-white/90 border-b border-slate-200 py-4 sticky top-0 z-50 backdrop-blur-md shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-4 lg:gap-8">
            <Link href={CLIENT_ROUTES.DASHBOARD}>
              <h1 className="text-xl sm:text-2xl font-bold text-blue-500 cursor-pointer">
                CourseHub
              </h1>
            </Link>
            
            {isAuthenticated && (
              <nav className="hidden lg:flex items-center gap-6">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors ${
                      isActive(link.href) || pathname?.startsWith(link.href)
                        ? 'text-blue-600'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>
          
          {isAuthenticated && user && (
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Open menu"
              >
                <LuMenu className="w-6 h-6 text-slate-700" />
              </button>

              <div className="hidden md:flex items-center gap-3">
                <Image
                  src={'https://cdn-icons-png.freepik.com/512/3607/3607444.png'}
                  alt={user.name || 'User avatar'}
                  width={36}
                  height={36}
                  className="rounded-full"
                />
                <span className="hidden xl:block text-sm text-slate-900 font-medium">
                  {user.name}
                </span>
              </div>

              <span className="hidden md:inline-block text-xs sm:text-sm font-semibold text-blue-500 bg-blue-50 px-2 sm:px-3 py-1.5 rounded-lg">
                Credits: {user.credits}
              </span>
              <Button onClick={handleLogout} variant="ghost" size="sm" loading={loggingOut} className="!hidden lg:!inline-flex">
                Logout
              </Button>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Navbar;
