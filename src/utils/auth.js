import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { auth } from "../firebase";

const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: "select_account",
});

export const loginWithGoogle = async () => {
  try {
    // Note: We removed setPersistence. Firebase defaults to local persistence automatically.
    // By removing the 'await', we ensure the popup opens INSTANTLY after the click, 
    // which stops iOS/Android from classifying it as a spam popup.
    
    await signInWithPopup(auth, provider);
    
  } catch (err) {
    console.error("Login Error:", err);
    
    // If a super-strict browser still blocks the popup, we gracefully fall back to redirect
    if (err.code === 'auth/popup-blocked') {
      console.warn("Popup blocked by strict browser. Falling back to redirect...");
      await signInWithRedirect(auth, provider);
    } else {
      alert("Authentication failed: " + err.message);
    }
  }
};