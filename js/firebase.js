import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const requiredConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const missingConfig = Object.entries(requiredConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

export const firebaseConfigError = missingConfig.length
  ? `Configure as variáveis Firebase ausentes: ${missingConfig.join(', ')}.`
  : null;

export const auth = firebaseConfigError
  ? null
  : getAuth(initializeApp({
      ...requiredConfig,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
    }));
