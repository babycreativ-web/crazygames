import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const sanitize = (val: string | undefined) => {
  if (!val) return undefined;
  return val.trim().replace(/['"\r\n]/g, "");
};

const firebaseConfig = {
  apiKey: sanitize(process.env.NEXT_PUBLIC_FIREBASE_API_KEY) || "placeholder-api-key-for-build",
  authDomain: sanitize(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) || "placeholder-auth-domain-for-build",
  projectId: sanitize(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) || "placeholder-project-id-for-build",
  storageBucket: sanitize(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET) || "placeholder-storage-bucket-for-build",
  messagingSenderId: sanitize(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID) || "placeholder-sender-id-for-build",
  appId: sanitize(process.env.NEXT_PUBLIC_FIREBASE_APP_ID) || "placeholder-app-id-for-build",
};

// Initialize Firebase only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };

