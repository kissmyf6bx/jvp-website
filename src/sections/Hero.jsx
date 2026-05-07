import { motion } from "framer-motion";
import { deleteUser, signOut } from "firebase/auth";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { auth } from "../firebase";

function Hero({
  user,
  showMenu,
  setShowMenu,
  profilePhoto,
  handleLogin,
  handlePhotoChange,
  clearProfilePhoto,
}) {
  return (
    <section
      id="home"
      className="relative h-screen w-full overflow-hidden bg-black text-white"
    >
      {/* VIDEO */}
      <video
        autoPlay
        muted
        loop
        playsInline
        webkit-playsinline="true"
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="https://github.com/kissmyf6bx/febiverse-hero-video/releases/download/bg-jvp/MISSION.SUNDAY.mp4"
          type="video/mp4"
        />
      </video>

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/50 z-0"></div>

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        {/* PROFILE / LOGIN */}
        <div className="absolute bottom-0 center z-10">
          {!user ? (
          <button
            onClick={handleLogin}
            className="
              relative
              z-50
              pointer-events-auto
              bg-white
              text-black
              px-6
              py-3
              rounded-full
            "
          >
            Login
          </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="
                  flex
                  items-center
                  gap-3
                  bg-white/10
                  backdrop-blur-md
                  border border-white/10
                  px-3
                  py-2
                  rounded-full
                  text-white
                  text-sm
                  hover:bg-white/20
                  transition
                "
              >
                <img
                  src={
                    profilePhoto
                      ? profilePhoto
                      : user?.photoURL
                        ? user.photoURL
                        : "https://ui-avatars.com/api/?name=User"
                  }
                  className="
                    w-8
                    h-8
                    rounded-full
                    object-cover
                  "
                  alt="User profile"
                />

                <span>{user.displayName}</span>
              </button>

              {showMenu && (
                <div
                  className="
                    absolute
                    bottom-16
                    right-0
                    bg-black/90
                    backdrop-blur-xl
                    border border-white/10
                    rounded-2xl
                    overflow-hidden
                    w-56
                    shadow-2xl
                    text-left
                  "
                >
                  <label
                    className="
                      block
                      px-4
                      py-3
                      text-white
                      hover:bg-white/10
                      cursor-pointer
                      transition
                    "
                  >
                    Change Profile Photo

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={clearProfilePhoto}
                    className="
                      w-full
                      text-left
                      px-4
                      py-3
                      text-yellow-400
                      hover:bg-yellow-500/10
                      transition
                    "
                  >
                    Remove Custom Photo
                  </button>

                  <button
                    onClick={async () => {
                      await signOut(auth);
                      setShowMenu(false);
                    }}
                    className="
                      w-full
                      text-left
                      px-4
                      py-3
                      text-white
                      hover:bg-white/10
                      transition
                    "
                  >
                    Logout
                  </button>

                  <button
                    onClick={async () => {
                      const confirmDelete = confirm(
                        "Are you sure you want to delete your account?"
                      );

                      if (!confirmDelete) return;

                      try {
                        await deleteUser(user);
                      } catch (err) {
                        alert(err.message);
                      }
                    }}
                    className="
                      w-full
                      text-left
                      px-4
                      py-3
                      text-red-400
                      hover:bg-red-500/10
                      transition
                    "
                  >
                    Delete Account
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4 }}
          className="text-5xl md:text-7xl font-heading tracking-tight"
        >
          Velankanni Parish
        </motion.h1>

        {/* SUBTEXT */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-4 text-gray-300 text-lg md:text-xl"
        >
          A place of faith and love
        </motion.p>

        {/* SOCIAL LINKS */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="mt-6 flex items-center justify-center gap-3"
        >
          <a
            href="http://www.youtube.com/@velankanniparish"
            target="_blank"
            rel="noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-lg text-white backdrop-blur-md transition hover:border-red-500/40 hover:bg-red-500 hover:text-white"
            aria-label="Open Velankanni Parish YouTube"
          >
            <FaYoutube />
          </a>

          <a
            href="https://www.instagram.com/jvp.youth?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-lg text-white backdrop-blur-md transition hover:border-pink-500/40 hover:bg-pink-500 hover:text-white"
            aria-label="Open JVP Youth Instagram"
          >
            <FaInstagram />
          </a>

          <a
            href="https://www.facebook.com/share/p/197U8SAEsi/"
            target="_blank"
            rel="noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-lg text-white backdrop-blur-md transition hover:border-blue-500/40 hover:bg-blue-500 hover:text-white"
            aria-label="Open Velankanni Parish Facebook"
          >
            <FaFacebookF />
          </a>
        </motion.div>
      </div>

      <motion.a
        href="https://www.febiverse.tech"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-center text-xs text-gray-400 transition hover:text-white"
      >
        Liked the website? Connect to the{" "}
        <span className="text-blue-400 hover:text-blue-300">Developer</span>.
      </motion.a>
    </section>
  );
}

export default Hero;
