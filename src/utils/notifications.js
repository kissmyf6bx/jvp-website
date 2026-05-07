import { getToken, onMessage } from "firebase/messaging";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db, getFirebaseMessaging } from "../firebase";

const VAPID_KEY = "BDl_MDEf-AFF3-llbDtiuXjc5y1l7mF_6Eov1tdMEgvW1LjKhmXvIOqJc6g1TYDLj-YkhrCiU5XqCJYpJjQa31U";

export const registerForPushNotifications = async () => {
  try {
    if (!("Notification" in window)) return null;

    let permission = Notification.permission;

    if (permission === "default") {
      const alreadyAsked = localStorage.getItem("notificationPermissionAsked");
      if (alreadyAsked) return null;

      localStorage.setItem("notificationPermissionAsked", "true");
      permission = await Notification.requestPermission();
    }

    if (permission !== "granted") return null;

    const messaging = await getFirebaseMessaging();
    if (!messaging) return null;

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: await navigator.serviceWorker.ready,
    });

    if (!token) return null;

    await setDoc(
      doc(db, "notificationTokens", token),
      {
        token,
        createdAt: serverTimestamp(),
        userAgent: navigator.userAgent,
      },
      { merge: true }
    );

    return token;
  } catch (error) {
    console.error("Push notification registration failed:", error);
    return null;
  }
};

export const listenForForegroundNotifications = async () => {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return;

  onMessage(messaging, (payload) => {
    const title = payload.notification?.title || "Velankanni Parish";
    const body = payload.notification?.body || "You have a new notification.";
    const image = payload.notification?.image || payload.data?.image;

    if (Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: "/logo.png",
        image,
      });
    }
  });
};
