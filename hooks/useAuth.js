// Custom React hook for Firebase Authentication
'use client';

import { useState, useEffect } from 'react';
import { onAuthChange } from '@/lib/firebaseAuth';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return { user, loading };
}
