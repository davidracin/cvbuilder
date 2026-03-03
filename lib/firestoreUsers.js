// Firestore user operations
import { doc, getDoc, updateDoc, deleteDoc, onSnapshot, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Get user profile data from Firestore
 * @param {string} userId - The user's UID
 * @returns {Promise<Object|null>} User data or null if not found
 */
export const getUserProfile = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    throw error;
  }
};

/**
 * Update user profile information
 * @param {string} userId - The user's UID
 * @param {Object} profileData - Data to update (firstName, lastName, etc.)
 * @returns {Promise<void>}
 */
export const updateUserProfile = async (userId, profileData) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      ...profileData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Delete all user data: all CVs and the user document
 * @param {string} userId - The user's UID
 * @returns {Promise<void>}
 */
export const deleteUserData = async (userId) => {
  try {
    // Delete all CVs belonging to this user
    const cvsQuery = query(collection(db, 'cvs'), where('userId', '==', userId));
    const cvsSnapshot = await getDocs(cvsQuery);
    const deletePromises = cvsSnapshot.docs.map((cvDoc) => deleteDoc(cvDoc.ref));
    await Promise.all(deletePromises);

    // Delete the user document
    const userDocRef = doc(db, 'users', userId);
    await deleteDoc(userDocRef);
  } catch (error) {
    throw error;
  }
};

/**
 * Subscribe to real-time user profile updates from Firestore
 * @param {string} userId - The user's UID
 * @param {Function} callback - Called with profile data on each change
 * @returns {Function} Unsubscribe function
 */
export const subscribeUserProfile = (userId, callback) => {
  const userDocRef = doc(db, 'users', userId);
  return onSnapshot(userDocRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      callback(null);
    }
  }, (error) => {
    console.error('Error subscribing to user profile:', error);
    callback(null);
  });
};
