'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { logOut } from '@/lib/firebaseAuth';
import { getUserProfile } from '@/lib/firestoreUsers';
import { Button } from '@/components/ui/button';
import { ChevronDown, User, Menu, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Navbar() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [userName, setUserName] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loadUserName = async () => {
      if (user?.uid) {
        try {
          const userData = await getUserProfile(user.uid);
          if (userData && userData.firstName && userData.lastName) {
            setUserName(`${userData.firstName} ${userData.lastName}`);
          } else if (user.displayName) {
            setUserName(user.displayName);
          } else {
            setUserName(user.email);
          }
        } catch (error) {
          console.error('Error loading user name:', error);
          setUserName(user.email);
        }
      }
    };

    loadUserName();
  }, [user]);

  const handleLogout = async () => {
    await logOut();
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          {!user && (
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          )}

          {/* Logo and desktop navigation */}
          <div className="flex flex-1 items-center justify-center sm:items-center sm:justify-start">
            <div className="flex shrink-0 items-center">
              <Link href="/" className="inline-block leading-none hover:opacity-80 transition-opacity">
                <img 
                  src="/logo.svg" 
                  alt="CV Builder Logo" 
                  className="h-34 w-auto block"
                />
              </Link>
            </div>
            
            {/* Desktop main page link */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Link 
                href="/" 
                className="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                Hlavní stránka
              </Link>
            </div>
          </div>

          {/* Right side - Auth buttons/User menu */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {loading ? (
              <div className="h-9 w-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-sm gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{userName || user.email}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/templates" className="cursor-pointer">
                      Moje šablony
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      Nastavení
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    Odhlásit se
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  onClick={() => router.push('/login')}
                  variant="ghost"
                  size="sm"
                >
                  Přihlásit se
                </Button>
                <Button
                  onClick={() => router.push('/signup')}
                  size="sm"
                >
                  Registrovat se
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {!user && mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <Link
              href="/"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              Hlavní stránka
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                router.push('/login');
              }}
              className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              Přihlásit se
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                router.push('/signup');
              }}
              className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              Registrovat se
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
