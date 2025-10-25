'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CLIENT_ROUTES } from '@/routes';
import { NAV_LINKS } from '@/config/navConfig';
import Image from 'next/image';
import Button from '@components/ui/Button';
import { LuX } from 'react-icons/lu';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  userCredits?: number;
  onLogout: () => void;
  loggingOut: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  userName,
  userCredits,
  onLogout,
  loggingOut,
}) => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-0 w-full h-full bg-white shadow-2xl z-60 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <Link href={CLIENT_ROUTES.DASHBOARD} onClick={onClose}>
              <h1 className="text-2xl font-bold text-blue-500">CourseHub</h1>
            </Link>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Close menu"
            >
              <LuX className="w-6 h-6 text-slate-600" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-6">
            <nav className="px-4 space-y-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.href)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="border-t border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="https://cdn-icons-png.freepik.com/512/3607/3607444.png"
                alt={userName || 'User avatar'}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">{userName}</p>
                <p className="text-xs text-slate-600">Credits: {userCredits}</p>
              </div>
            </div>

            <Button
              onClick={onLogout}
              variant="outline"
              size="md"
              loading={loggingOut}
              className="w-full"
            >
              Logout
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
