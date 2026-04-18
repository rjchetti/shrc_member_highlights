import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, EmailAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// The user will replace these with their own config from the Firebase Console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "placeholder-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "shrc-member-highlights.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "shrc-member-highlights",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "shrc-member-highlights.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "placeholder-messaging-id",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "placeholder-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Providers
export const googleProvider = new GoogleAuthProvider();
export const emailProvider = new EmailAuthProvider();

// Admins (Marketing/PR Chairs)
export const ADMIN_EMAILS = [
  'rjchetti@gmail.com', // Added based on repo owner
  'president@seoulhanmaumrotaryclub.org', // Club President
  'marketing@hanmaeumrotaryclub.org', // Marketing/PR Chair
  // Add other chair emails here
];

export default app;
