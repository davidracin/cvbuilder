'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { onAuthChange, auth } from '@/lib/firebaseAuth';
import { subscribeUserProfile } from '@/lib/firestoreUsers';

const AuthContext = createContext({
  user: null,
  profile: null,
  loading: true,
  refreshUser: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Refresh the Firebase Auth user object (picks up emailVerified, displayName changes)
  const refreshUser = useCallback(async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      // Clone the user object to trigger re-renders (reload mutates in place)
      setUser({ ...auth.currentUser });
    }
  }, []);

  // Subscribe to Firebase Auth state changes + set auth cookie
  useEffect(() => {
    const unsubscribe = onAuthChange(async (authUser) => {
      setUser(authUser);
      setLoading(false);

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
        setProfile(null);
        try {
          await fetch('/api/auth/cookie', {
            method: 'DELETE',
          });
        } catch (error) {
          // Error removing cookie
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Subscribe to Firestore user profile with onSnapshot (real-time updates)
  useEffect(() => {
    if (!user?.uid) {
      setProfile(null);
      return;
    }

    const unsubscribe = subscribeUserProfile(user.uid, (profileData) => {
      setProfile(profileData);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
