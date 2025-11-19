'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { logOut } from '@/lib/firebaseAuth';
import { Button } from '@/components/ui/button';
import { ChevronDown, User } from 'lucide-react';
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

  const handleLogout = async () => {
    await logOut();
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Image 
                src="/logo.svg" 
                alt="CV Builder Logo" 
                width={250} 
                height={150}
                priority
              />
            </Link>
            
            {/* Main page link */}
            <Link href="/" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              Hlavní stránka
            </Link>
          </div>

          {/* Auth buttons */}
          <div className="flex items-center gap-4">
            {loading ? (
              <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-sm gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{user.email}</span>
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
              <>
                <Button
                  onClick={() => router.push('/login')}
                  variant="ghost"
                  className="text-sm"
                >
                  Přihlásit se
                </Button>
                <Button
                  onClick={() => router.push('/signup')}
                  className="text-sm"
                >
                  Registrovat se
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
