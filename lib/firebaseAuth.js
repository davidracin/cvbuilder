// Firebase Authentication helper functions
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import app from './firebase';
import { db } from './firebase';

// Initialize auth
export const auth = getAuth(app);

// Sign up with email and password
export const signUp = async (email, password, firstName = '', lastName = '') => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with display name
    const displayName = `${firstName} ${lastName}`.trim();
    if (displayName) {
      await updateProfile(user, { displayName });
    }
    
    // Save user data to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      firstName,
      lastName,
      cvCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Get the ID token and set it as a cookie
    const token = await user.getIdToken();
    await fetch('/api/auth/cookie', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    
    return { user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

// Sign in with email and password
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get the ID token and set it as a cookie
    const token = await user.getIdToken();
    await fetch('/api/auth/cookie', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    
    return { user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

// Sign out
export const logOut = async () => {
  try {
    // Remove the auth cookie
    await fetch('/api/auth/cookie', {
      method: 'DELETE',
    });
    
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// Reset password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// Listen to auth state changes
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
