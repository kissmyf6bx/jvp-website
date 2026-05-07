import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function useSettings() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const ref = doc(db, "settings", "main");
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setSettings(snap.data());
      }
    };

    fetchSettings();
  }, []);

  return settings;
}