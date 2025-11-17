'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { logOut } from '@/lib/firebaseAuth';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleLogout = async () => {
    await logOut();
    router.push('/');
  };

  return (
    <nav className="w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link href="/" className="text-xl font-bold text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            CV Builder
          </Link>

          {/* Auth buttons */}
          <div className="flex items-center gap-4">
            {loading ? (
              <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
            ) : user ? (
              <>
                <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:block">
                  {user.email}
                </span>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="text-sm"
                >
                  Odhlásit se
                </Button>
              </>
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
