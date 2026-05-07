import { auth, provider } from "../firebase";
import {
  signInWithPopup,
  signInWithRedirect
} from "firebase/auth";

export const loginWithGoogle = async () => {

  const isMobile =
    /iPhone|iPad|iPod|Android/i.test(
      navigator.userAgent
    );

  if (isMobile) {

    await signInWithRedirect(
      auth,
      provider
    );

  } else {

    await signInWithPopup(
      auth,
      provider
    );

  }

};