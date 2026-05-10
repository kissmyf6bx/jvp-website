import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { auth } from "../firebase";

const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: "select_account",
});

export const loginWithGoogle = async () => {
  try {
    // Force local persistence so the session survives tab closes
    await setPersistence(auth, browserLocalPersistence);

    // Default to Popup. It keeps the main React app alive in the background.
    await signInWithPopup(auth, provider);
    
  } catch (err) {
    console.error("Login Error:", err);
    
    // If the mobile browser aggressively blocks the popup, we catch the error 
    // and ONLY then fallback to the redirect method.
    if (err.code === 'auth/popup-blocked') {
      alert("Popup blocked by browser. Redirecting to login...");
      await signInWithRedirect(auth, provider);
    } else {
      alert("Authentication failed: " + err.message);
    }
  }
};