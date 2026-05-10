import { useState, useEffect } from "react";

export const usePWA = () => {
  // Pull from the global window object in case React loaded late
  const [deferredPrompt, setDeferredPrompt] = useState(window.pwaDeferredPrompt || null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone) {
      setIsStandalone(true);
    }

    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      window.pwaDeferredPrompt = e;
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Backup check
    if (window.pwaDeferredPrompt && !deferredPrompt) {
      setDeferredPrompt(window.pwaDeferredPrompt);
    }

    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, [deferredPrompt]);

  const triggerInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
        window.pwaDeferredPrompt = null;
      }
    } else {
      alert("Install prompt not ready. Make sure you are not in Incognito mode.");
    }
  };

  return { triggerInstall, canInstall: !!deferredPrompt, isIOS, isStandalone };
};