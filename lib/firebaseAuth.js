// Firebase Authentication helper functions
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { deleteUserData } from './firestoreUsers';
import app from './firebase';
import { db } from './firebase';

// Initialize auth
export const auth = getAuth(app);

// Helper function to convert Firebase error codes to user-friendly messages
const getErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/invalid-email': 'Neplatná e-mailová adresa.',
    'auth/user-disabled': 'Tento účet byl deaktivován.',
    'auth/user-not-found': 'Nesprávný e-mail nebo heslo.',
    'auth/wrong-password': 'Nesprávný e-mail nebo heslo.',
    'auth/invalid-credential': 'Nesprávný e-mail nebo heslo.',
    'auth/email-already-in-use': 'Tento e-mail je již používán.',
    'auth/weak-password': 'Heslo je příliš slabé.',
    'auth/too-many-requests': 'Příliš mnoho pokusů. Zkuste to prosím později.',
    'auth/network-request-failed': 'Chyba připojení. Zkontrolujte své internetové připojení.',
    'auth/operation-not-allowed': 'Tato operace není povolena.',
    'auth/requires-recent-login': 'Pro tuto operaci se prosím přihlaste znovu.',
  };
  
  return errorMessages[errorCode] || 'Došlo k neočekávané chybě. Zkuste to prosím znovu.';
};

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
    
    // Send email verification
    try {
      await sendEmailVerification(user);
    } catch (verificationError) {
      // Continue with signup even if verification email fails
    }
    
    // Save user data to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      firstName,
      lastName,
      cvCount: 0,
      gdprConsent: true,
      gdprConsentAt: serverTimestamp(),
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
    return { user: null, error: getErrorMessage(error.code) };
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
    return { user: null, error: getErrorMessage(error.code) };
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
    return { error: getErrorMessage(error.code) };
  }
};

// Reset password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error) {
    return { error: getErrorMessage(error.code) };
  }
};

// Resend email verification
export const resendVerificationEmail = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { error: 'Nejste přihlášeni.' };
    }
    if (user.emailVerified) {
      return { error: 'Váš email je již ověřen.' };
    }
    await sendEmailVerification(user);
    return { error: null };
  } catch (error) {
    if (error.code === 'auth/too-many-requests') {
      return { error: 'Příliš mnoho pokusů. Zkuste to prosím později.' };
    }
    return { error: getErrorMessage(error.code) };
  }
};

// Delete account and all associated data
export const deleteAccount = async (password) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { error: 'Nejste přihlášeni.' };
    }

    // Re-authenticate before deleting
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);

    const uid = user.uid;

    // Delete all Firestore data (CVs + user doc)
    await deleteUserData(uid);

    // Delete Firebase Auth user
    await deleteUser(user);

    // Clear auth cookie
    await fetch('/api/auth/cookie', {
      method: 'DELETE',
    });

    return { error: null };
  } catch (error) {
    if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      return { error: 'Nesprávné heslo.' };
    }
    if (error.code === 'auth/requires-recent-login') {
      return { error: 'Odhlaste se a přihlaste se znovu, poté zkuste smazat účet.' };
    }
    return { error: getErrorMessage(error.code) };
  }
};

// Listen to auth state changes
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
