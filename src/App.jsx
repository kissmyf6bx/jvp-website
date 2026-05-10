import { useState, useEffect } from "react";
import { Navigate, Routes, Route, useNavigate } from "react-router-dom";

import Navbar from "./components/Navbar";

import Hero from "./sections/Hero";
import About from "./sections/About";
import Mission from "./sections/Mission";
import Events from "./sections/Events";
import Donate from "./sections/Donate";
import DonatePage from "./pages/DonatePage";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";

import EventDetail from "./pages/EventDetail";
import EventsPage from "./pages/EventsPage";
import Admin from "./pages/Admin";

import { Helmet } from "react-helmet-async";

import { loginWithGoogle } from "./utils/auth";

import { auth } from "./firebase";

import { onAuthStateChanged, getRedirectResult } from "firebase/auth";

import { useSettings } from "./hooks/useSettings";

function Home({ user, handleLogin }) {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const { settings } = useSettings();

  useEffect(() => {
    const savedPosition = sessionStorage.getItem("homeScrollPosition");

    if (savedPosition) {
      setTimeout(() => {
        window.scrollTo({
          top: parseInt(savedPosition),
          behavior: "instant"
        });
      }, 50);
    }
  }, []);

  // USER-SPECIFIC PROFILE PHOTO
  const [profilePhoto, setProfilePhoto] = useState("");

  // LOAD USER PHOTO
  useEffect(() => {
    if (!user) return;

    const savedPhoto = localStorage.getItem(`profilePhoto_${user.uid}`);

    if (savedPhoto) {
      setProfilePhoto(savedPhoto);
    } else {
      setProfilePhoto("");
    }
  }, [user]);

  // CHANGE PHOTO
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      localStorage.setItem(`profilePhoto_${user.uid}`, reader.result);
      setProfilePhoto(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleDonate = async () => {
    if (user) {
      navigate("/donate");
      return;
    }

    sessionStorage.setItem("pendingDonateRedirect", "true");
    await handleLogin();
  };

  return (
    <>
      <Helmet>
        <title>Velankanni Parish | Mysore</title>

        <meta
          name="description"
          content="Official website of Velankanni Parish - JP Nagar, Mysore."
        />

        <meta property="og:image" content="/og-image.png" />
      </Helmet>

      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
        <Hero
        user={user}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        profilePhoto={profilePhoto}
        handleLogin={handleLogin}
        handlePhotoChange={handlePhotoChange}
        settings={settings} // <--- Pass settings here
        clearProfilePhoto={() => {
          localStorage.removeItem(`profilePhoto_${user.uid}`);
          setProfilePhoto("");
        }}
      />

      {/* ABOUT */}
      <About settings={settings} />

      {/* MISSION */}
      <Mission settings={settings} />

      {/* EVENTS */}
      <Events user={user} />

      {/* DONATE */}
      <Donate handleDonate={handleDonate} />

      {/* CONTACT */}
      <Contact />

      {/* FOOTER */}
      <Footer />
    </>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // AUTH LISTENER
  useEffect(() => {
    // 1. Manually resolve the mobile redirect result
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          console.log("Successfully logged in via redirect:", result.user);
        }
      })
      .catch((error) => {
        console.error("Redirect resolution error:", error);
        alert("Mobile login failed: " + error.message);
      });

    // 2. Standard Auth Listener
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("AUTH USER:", currentUser);

      setUser(currentUser);
      setLoading(false);

      // DONATE REDIRECT
      if (currentUser && sessionStorage.getItem("pendingDonateRedirect")) {
        sessionStorage.removeItem("pendingDonateRedirect");
        window.location.href = "/donate";
      }
    });

    return () => unsubscribe();
  }, []);

  // LOGIN
  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="h-screen bg-black" />;
  }

  return (
    <Routes>
      {/* HOME */}
      <Route
        path="/"
        element={<Home user={user} handleLogin={handleLogin} />}
      />

      {/* EVENTS PAGE */}
      <Route path="/events" element={<EventsPage />} />

      {/* EVENT DETAIL */}
      <Route path="/event/:id" element={<EventDetail />} />

      {/* ADMIN */}
      <Route path="/admin" element={<Admin user={user} />} />

      {/* DONATE */}
      <Route
        path="/donate"
        element={user ? <DonatePage /> : <Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;