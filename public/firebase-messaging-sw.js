importScripts("https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.5/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyA3-HQO7whwElJgCz_uULDBCil9sWj4MW8",
  authDomain: "velankanni-parish-jvp.firebaseapp.com",
  projectId: "velankanni-parish-jvp",
  storageBucket: "velankanni-parish-jvp.firebasestorage.app",
  messagingSenderId: "590487161134",
  appId: "1:590487161134:web:43e4bcd8e1f1707fa652bf",
  measurementId: "G-VR814V9TDH"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || "Velankanni Parish";
  const options = {
    body: payload.notification?.body || "You have a new notification.",
    icon: "/logo.png",
    badge: "/logo.png",
    image: payload.notification?.image || payload.data?.image,
  };

  self.registration.showNotification(title, options);
});
