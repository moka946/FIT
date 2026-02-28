import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const configKeys = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId'
];

export const missingFirebaseConfigKeys = configKeys.filter((key) => !firebaseConfig[key]);

let app = null;
let auth = null;
let db = null;
let firebaseInitError = null;

try {
  if (missingFirebaseConfigKeys.length > 0) {
    throw new Error(`Missing Firebase config: ${missingFirebaseConfigKeys.join(', ')}`);
  }

  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  firebaseInitError = error;
  console.error('Firebase initialization failed:', error);
}

export { auth, db, firebaseInitError };
export default app;
