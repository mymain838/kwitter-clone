// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyASLLOj6cST5_dhjvAlMhvf8fG-UYQO5Tw',
  authDomain: 'kwitter-20288.firebaseapp.com',
  projectId: 'kwitter-20288',
  storageBucket: 'kwitter-20288.appspot.com',
  messagingSenderId: '1078694483505',
  appId: '1:1078694483505:web:e805f05ee6c3efe3aa2710',
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
