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

import {
  Helmet
} from "react-helmet-async";

import { loginWithGoogle } from "./utils/auth";

import { auth } from "./firebase";

import {
  onAuthStateChanged
} from "firebase/auth";

<Helmet>

  {/* TITLE */}
  <title>
    Velankanni Parish Youth |
    Bangalore
  </title>

  {/* DESCRIPTION */}
  <meta
    name="description"
    content="
      Official website of
      Velankanni Parish Youth.
      Explore parish events,
      mission, activities,
      donations and community.
    "
  />

  {/* KEYWORDS */}
  <meta
    name="keywords"
    content="
      Velankanni Parish,
      JVP,
      Bangalore Church,
      Catholic Youth,
      Parish Events,
      Velankanni Youth
    "
  />

  {/* AUTHOR */}
  <meta
    name="author"
    content="
      Velankanni Parish Youth
    "
  />

  {/* OPEN GRAPH */}
  <meta
    property="og:title"
    content="
      Velankanni Parish Youth
    "
  />

  <meta
    property="og:description"
    content="
      Official parish youth
      website of Velankanni
      Parish Bangalore.
    "
  />

  <meta
    property="og:image"
    content="/og-image.png"
  />

  <meta
    property="og:type"
    content="website"
  />

  {/* TWITTER */}
  <meta
    name="twitter:card"
    content="summary_large_image"
  />

  {/* STRUCTURED DATA */}
  <script type="application/ld+json">
    {`
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Velankanni Parish Youth",
        "url": "https://YOURDOMAIN.com",
        "logo": "https://YOURDOMAIN.com/jvp-logo.png",
        "description": "Official website of Velankanni Parish Youth Bangalore.",
        "sameAs": [
          "https://instagram.com/YOURPAGE"
        ]
      }
    `}
  </script>

</Helmet>

function Home({ user, handleLogin }) {

  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {

  const savedPosition = sessionStorage.getItem(
    "homeScrollPosition"
  );

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

    const savedPhoto = localStorage.getItem(
      `profilePhoto_${user.uid}`
    );

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

      localStorage.setItem(
        `profilePhoto_${user.uid}`,
        reader.result
      );

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
        handleDonate={handleDonate}
        clearProfilePhoto={() => {
          localStorage.removeItem(`profilePhoto_${user.uid}`);
          setProfilePhoto("");
        }}
      />

      {/* ABOUT */}
      <About />

      {/* MISSION */}
      <Mission />

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

  // AUTH LISTENER
  useEffect(() => {

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
      }
    );

    return () => unsubscribe();

  }, []);

  useEffect(() => {
    if (!user) return;

    const shouldRedirectToDonate = sessionStorage.getItem(
      "pendingDonateRedirect"
    );

    if (shouldRedirectToDonate) {
      sessionStorage.removeItem("pendingDonateRedirect");
      window.location.href = "/donate";
    }
  }, [user]);

  // LOGIN
  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Routes>

      {/* HOME */}
      <Route
        path="/"
        element={
          <Home
            user={user}
            handleLogin={handleLogin}
          />
        }
      />

      {/* EVENTS PAGE */}
      <Route
        path="/events"
        element={<EventsPage />}
      />

      {/* EVENT DETAIL */}
      <Route
        path="/event/:id"
        element={<EventDetail />}
      />

      {/* ADMIN */}
      <Route
        path="/admin"
        element={<Admin user={user} />}
      />

      <Route
      path="/donate"
      element={user ? <DonatePage /> : <Navigate to="/" replace />}
      />

    </Routes>
  );
}

export default App;
