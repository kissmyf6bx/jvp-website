import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyA3-HQO7whwElJgCz_uULDBCil9sWj4MW8",
  authDomain: "velankanni-parish-jvp.firebaseapp.com",
  projectId: "velankanni-parish-jvp",
  storageBucket: "velankanni-parish-jvp.firebasestorage.app",
  messagingSenderId: "590487161134",
  appId: "1:590487161134:web:43e4bcd8e1f1707fa652bf",
  measurementId: "G-VR814V9TDH"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

// Auth
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// Messaging
export const getFirebaseMessaging = async () => {
  const supported = await isSupported();
  if (!supported) return null;

  return getMessaging(app);
};

export { app, firebaseConfig };
