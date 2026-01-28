// Custom React hook for Firebase Authentication
'use client';

import { useState, useEffect } from 'react';
import { onAuthChange } from '@/lib/firebaseAuth';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (authUser) => {
      setUser(authUser);
      setLoading(false);
      
      // Set or remove the auth cookie based on user state
      if (authUser) {
        try {
          const token = await authUser.getIdToken();
          await fetch('/api/auth/cookie', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
          });
        } catch (error) {
          // Error setting cookie
        }
      } else {
        try {
          await fetch('/api/auth/cookie', {
            method: 'DELETE',
          });
        } catch (error) {
          // Error removing cookie
        }
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return { user, loading };
}
