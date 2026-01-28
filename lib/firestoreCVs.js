// Firestore operations for CV management
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db } from './firebase';

const CV_COLLECTION = 'cvs';
const USERS_COLLECTION = 'users';

// Template display names for auto-naming
const TEMPLATE_NAMES = {
  moderni: 'Moderní',
  klasicke: 'Klasické',
  kreativni: 'Kreativní',
  profesionalni: 'Profesionální'
};

// Generate auto CV name based on template and existing count
const generateCVName = async (userId, templateType) => {
  const templateName = TEMPLATE_NAMES[templateType] || templateType;
  
  // Get all CVs with this template type for this user
  const q = query(
    collection(db, CV_COLLECTION),
    where('userId', '==', userId),
    where('templateType', '==', templateType)
  );
  
  const snapshot = await getDocs(q);
  const count = snapshot.size + 1;
  
  return `${templateName} #${count}`;
};

// Create a new CV
export const createCV = async (userId, cvData, templateType, cvName = null) => {
  try {
    // Generate name if not provided
    const finalName = cvName || await generateCVName(userId, templateType);
    
    const docRef = await addDoc(collection(db, CV_COLLECTION), {
      userId,
      templateType,
      cvName: finalName,
      cvData,
      thumbnailUrl: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastExported: null
    });
    
    // Increment user's CV count
    await incrementUserCVCount(userId);
    
    return { id: docRef.id, cvName: finalName, error: null };
  } catch (error) {
    return { id: null, cvName: null, error: error.message };
  }
};

// Update an existing CV
export const updateCV = async (cvId, cvData, cvName = null) => {
  try {
    const docRef = doc(db, CV_COLLECTION, cvId);
    const updateData = {
      cvData,
      updatedAt: serverTimestamp()
    };
    
    if (cvName !== null) {
      updateData.cvName = cvName;
    }
    
    await updateDoc(docRef, updateData);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// Get a single CV by ID
export const getCV = async (cvId) => {
  try {
    const docRef = doc(db, CV_COLLECTION, cvId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { 
        cv: { 
          id: docSnap.id, 
          ...docSnap.data() 
        }, 
        error: null 
      };
    } else {
      return { cv: null, error: 'CV not found' };
    }
  } catch (error) {
    return { cv: null, error: error.message };
  }
};

// Get all CVs for a user
export const getUserCVs = async (userId) => {
  try {
    const q = query(
      collection(db, CV_COLLECTION),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const cvs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { cvs, error: null };
  } catch (error) {
    return { cvs: [], error: error.message };
  }
};

// Delete a CV
export const deleteCV = async (cvId, userId) => {
  try {
    await deleteDoc(doc(db, CV_COLLECTION, cvId));
    
    // Decrement user's CV count
    await decrementUserCVCount(userId);
    
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// Update last exported timestamp
export const updateLastExported = async (cvId) => {
  try {
    const docRef = doc(db, CV_COLLECTION, cvId);
    await updateDoc(docRef, {
      lastExported: serverTimestamp()
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// Update thumbnail URL
export const updateThumbnailUrl = async (cvId, thumbnailUrl) => {
  try {
    const docRef = doc(db, CV_COLLECTION, cvId);
    await updateDoc(docRef, {
      thumbnailUrl,
      updatedAt: serverTimestamp()
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// Increment user's CV count
const incrementUserCVCount = async (userId) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, {
      cvCount: increment(1)
    });
  } catch (error) {
    // Error updating CV count
  }
};

// Decrement user's CV count
const decrementUserCVCount = async (userId) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, {
      cvCount: increment(-1)
    });
  } catch (error) {
    // Error updating CV count
  }
};
