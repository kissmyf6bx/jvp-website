import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export const useSettings = () => {
  // We set fallback default values so the site never looks broken
  const [settings, setSettings] = useState({
    heroTitle: "Velankanni Parish",
    heroDesc: "A place of faith and love",
    heroVideo: "https://github.com/kissmyf6bx/febiverse-hero-video/releases/download/bg-jvp/MISSION.SUNDAY.mp4",
    aboutText: "Loading about text...",
    missionText: "Loading mission text...",
    aboutImages: [],
    missionImages: []
  });
  
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    // Listen to the exact document your Admin panel saves to
    const unsubscribe = onSnapshot(doc(db, "settings", "main"), (docSnap) => {
      if (docSnap.exists()) {
        // Merge the database settings with our defaults
        setSettings((prev) => ({ ...prev, ...docSnap.data() }));
      }
      setLoadingSettings(false);
    }, (error) => {
      console.error("Error fetching settings:", error);
      setLoadingSettings(false);
    });

    return () => unsubscribe();
  }, []);

  return { settings, loadingSettings };
};