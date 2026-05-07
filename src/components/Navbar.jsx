import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiBell, FiCalendar, FiChevronRight, FiMenu, FiX } from "react-icons/fi";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  listenForForegroundNotifications,
  registerForPushNotifications,
} from "../utils/notifications";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMassTimingsOpen, setIsMassTimingsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [readNotificationIds, setReadNotificationIds] = useState([]);
  const [clearedNotificationIds, setClearedNotificationIds] = useState([]);
  const [activeNotification, setActiveNotification] = useState(null);

  const menuItems = [
    { name: "Home", id: "home" },
    { name: "About", id: "about" },
    { name: "Mission", id: "mission" },
    { name: "Events", id: "events" },
    { name: "Donate", id: "donate" },
    { name: "Contact", id: "contact" },
  ];

  const scrollToSection = (id) => {
    const el = document.getElementById(id);

    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
      });
    }

    setIsOpen(false);
  };

  const formatNotificationDate = (createdAt) => {
    const date = createdAt?.toDate ? createdAt.toDate() : null;
    if (!date) return "Just now";

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const visibleNotifications = notifications.filter(
    (notification) => !clearedNotificationIds.includes(notification.id)
  );

  const unreadNotifications = visibleNotifications.filter(
    (notification) => !readNotificationIds.includes(notification.id)
  );

  const markNotificationRead = (id) => {
    setReadNotificationIds((currentIds) => {
      if (currentIds.includes(id)) return currentIds;

      const nextIds = [...currentIds, id];
      localStorage.setItem("readNotifications", JSON.stringify(nextIds));
      return nextIds;
    });
  };

  const clearNotification = (id) => {
    setClearedNotificationIds((currentIds) => {
      if (currentIds.includes(id)) return currentIds;

      const nextIds = [...currentIds, id];
      localStorage.setItem("clearedNotifications", JSON.stringify(nextIds));
      return nextIds;
    });

    markNotificationRead(id);
  };

  const openNotification = (notification) => {
    markNotificationRead(notification.id);

    if (notification.canOpen && notification.fullMessage) {
      setActiveNotification(notification);
    }
  };

  useEffect(() => {
    const storedReadIds = JSON.parse(
      localStorage.getItem("readNotifications") || "[]"
    );
    const storedClearedIds = JSON.parse(
      localStorage.getItem("clearedNotifications") || "[]"
    );

    setReadNotificationIds(storedReadIds);
    setClearedNotificationIds(storedClearedIds);

    registerForPushNotifications();
    listenForForegroundNotifications();

    const notificationsQuery = query(
      collection(db, "notifications"),
      orderBy("createdAt", "desc"),
      limit(20)
    );

    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setNotifications(data);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const shouldLockScroll =
      isNotificationsOpen || isMassTimingsOpen || activeNotification || isOpen;
    const originalOverflow = document.body.style.overflow;

    if (shouldLockScroll) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isNotificationsOpen, isMassTimingsOpen, activeNotification, isOpen]);

  return (
    <>
      {/* NAVBAR */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="fixed top-0 left-0 w-full z-[9999] bg-black/30 backdrop-blur-md border-b border-white/10"
      >
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            {/* LOGO */}
            <img
              src="/logo.png"
              className="h-10 object-contain"
              alt="Velankanni Parish Logo"
            />

            {/* MASS TIMINGS BUTTON */}
            <button
              onClick={() => setIsMassTimingsOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-xl text-white backdrop-blur-md transition hover:bg-white/15"
              aria-label="Open Mass timings"
            >
              <FiCalendar />
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* NOTIFICATION BUTTON */}
            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-xl text-white backdrop-blur-md transition hover:bg-white/15"
              aria-label="Open notifications"
            >
              <FiBell />

              {unreadNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-black bg-red-500"></span>
              )}
            </button>

            {/* MENU BUTTON */}
            <button
              onClick={() => setIsOpen(true)}
              className="text-white text-2xl"
              aria-label="Open menu"
            >
              <FiMenu />
            </button>
          </div>
        </div>
      </motion.div>

      {/* MASS TIMINGS PANEL */}
      <AnimatePresence>
        {isMassTimingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] overflow-hidden bg-black/70 px-5 py-6 backdrop-blur-xl"
          >
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-sm rounded-3xl border border-white/10 bg-black/90 p-5 text-white shadow-2xl"
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                    Parish Schedule
                  </p>
                  <h2 className="mt-1 text-2xl font-heading">Mass Timings</h2>
                </div>

                <button
                  onClick={() => setIsMassTimingsOpen(false)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10 text-xl text-white"
                  aria-label="Close Mass timings"
                >
                  <FiX />
                </button>
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h3 className="mb-3 text-sm font-semibold text-white">
                    Daily Mass
                  </h3>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p className="flex justify-between gap-4">
                      <span>Monday to Friday</span>
                      <span className="text-right text-white">6 AM English</span>
                    </p>
                    <p className="flex justify-between gap-4">
                      <span>Saturday</span>
                      <span className="text-right text-white">6 PM Kannada</span>
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h3 className="mb-3 text-sm font-semibold text-white">
                    Sunday Mass
                  </h3>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p className="flex justify-between gap-4">
                      <span>Morning</span>
                      <span className="text-right text-white">7 AM English</span>
                    </p>
                    <p className="flex justify-between gap-4">
                      <span>Morning</span>
                      <span className="text-right text-white">8:30 AM Kannada</span>
                    </p>
                  </div>
                </div>

                <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-5 text-gray-400">
                  Special events or feast-day changes will be shared through the
                  WhatsApp group or push notifications.
                </p>

                <a
                  href="https://chat.whatsapp.com/InJ1l1HMHAWEd47tWimK42"
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-gray-200"
                >
                  Join WhatsApp Group
                </a>

                <a
                  href="https://www.febiverse.tech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center text-xs text-gray-500 transition hover:text-gray-300"
                >
                  Website developed by{" "}
                  <span className="text-blue-400 hover:text-blue-300">
                    Febin | Febiverse
                  </span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NOTIFICATION PANEL */}
      <AnimatePresence>
        {isNotificationsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] overflow-hidden bg-black/70 px-5 py-6 backdrop-blur-xl"
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="ml-auto flex max-h-[calc(100vh-3rem)] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-white/10 bg-black/90 p-6 text-white shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-heading">Notifications</h2>

                <button
                  onClick={() => setIsNotificationsOpen(false)}
                  className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white text-xl"
                  aria-label="Close notifications"
                >
                  <FiX />
                </button>
              </div>

              {visibleNotifications.length === 0 ? (
                <>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <p className="text-white text-base">No notifications yet</p>
                    <p className="text-gray-400 text-sm mt-2">
                      Parish updates and announcements will appear here.
                    </p>
                  </div>

                  <a
                    href="https://www.febiverse.tech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 block text-center text-xs text-gray-500 transition hover:text-gray-300"
                  >
                    Website developed by{" "}
                    <span className="text-blue-400 hover:text-blue-300">
                      Febin | Febiverse
                    </span>
                  </a>
                </>
              ) : (
                <>
                  <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
                    {visibleNotifications.map((notification) => {
                      const isUnread = !readNotificationIds.includes(notification.id);
                      const canOpen = notification.canOpen && notification.fullMessage;

                      return (
                      <div
                        key={notification.id}
                        className="overflow-hidden rounded-2xl border border-white/10 bg-[#111]"
                      >
                        <div
                          onClick={() => openNotification(notification)}
                          className={`overflow-hidden ${
                            canOpen ? "cursor-pointer" : "cursor-default"
                          }`}
                        >
                          {notification.image && (
                            <img
                              src={notification.image}
                              alt={notification.title || "Notification"}
                              className="h-36 w-full object-cover"
                            />
                          )}

                          <div className="p-5">
                            <div className="mb-3 flex items-start justify-between gap-4">
                              <div className="min-w-0">
                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                  {isUnread && (
                                    <span className="rounded-full bg-blue-500 px-2.5 py-1 text-xs font-medium text-white">
                                      New
                                    </span>
                                  )}

                                  {canOpen && (
                                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-gray-300">
                                      Tap to read
                                    </span>
                                  )}
                                </div>

                                <h3 className="text-lg font-semibold text-white">
                                  {notification.title}
                                </h3>
                              </div>

                              <div className="flex shrink-0 items-center gap-2">
                                <span className="text-xs text-gray-500">
                                  {formatNotificationDate(notification.createdAt)}
                                </span>

                                {canOpen && (
                                  <FiChevronRight className="text-gray-400" />
                                )}
                              </div>
                            </div>

                            <p className="text-sm leading-relaxed text-gray-300">
                              {notification.message}
                            </p>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                clearNotification(notification.id);
                              }}
                              className="mt-4 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-gray-300 transition hover:bg-white/15 hover:text-white"
                            >
                              Clear
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                    })}
                  </div>

                  <a
                    href="https://www.febiverse.tech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 block text-center text-xs text-gray-500 transition hover:text-gray-300"
                  >
                    Website developed by{" "}
                    <span className="text-blue-400 hover:text-blue-300">
                      Febin | Febiverse
                    </span>
                  </a>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NOTIFICATION DETAIL */}
      <AnimatePresence>
        {activeNotification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10002] bg-black/80 px-5 py-6 backdrop-blur-2xl"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="mx-auto flex h-full w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-black text-white shadow-2xl"
            >
              {activeNotification.image && (
                <img
                  src={activeNotification.image}
                  alt={activeNotification.title || "Notification"}
                  className="h-56 w-full object-cover"
                />
              )}

              <div className="flex items-start justify-between gap-5 border-b border-white/10 p-6">
                <div>
                  <p className="mb-2 text-sm text-gray-500">
                    {formatNotificationDate(activeNotification.createdAt)}
                  </p>
                  <h2 className="text-3xl font-heading">
                    {activeNotification.title}
                  </h2>
                </div>

                <button
                  onClick={() => setActiveNotification(null)}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10 text-xl text-white"
                  aria-label="Close notification"
                >
                  <FiX />
                </button>
              </div>

              <div className="overflow-y-auto p-6">
                <p className="whitespace-pre-line text-base leading-8 text-gray-200">
                  {activeNotification.fullMessage}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULLSCREEN MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
              fixed
              inset-0
              z-[10000]
              bg-black/95
              backdrop-blur-2xl
            "
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setIsOpen(false)}
              className="
                fixed
                top-6
                right-6
                z-[10001]
                w-12
                h-12
                rounded-full
                bg-white/10
                border
                border-white/10
                flex
                items-center
                justify-center
                text-white
                text-2xl
              "
              aria-label="Close menu"
            >
              <FiX />
            </button>

            {/* MENU CONTENT */}
            <div
              className="
                h-full
                flex
                flex-col
                items-center
                justify-center
                gap-8
              "
            >
              {menuItems.map((item, i) => (
                <motion.button
                  key={i}
                  onClick={() => scrollToSection(item.id)}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="
                    text-white
                    text-4xl
                    md:text-6xl
                    font-heading
                    tracking-tight
                  "
                >
                  {item.name}
                </motion.button>
              ))}
            </div>

            <a
              href="https://www.febiverse.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="fixed bottom-8 left-1/2 z-[10001] -translate-x-1/2 text-center text-xs text-gray-500 transition hover:text-gray-300"
            >
              Website developed by{" "}
              <span className="text-blue-400 hover:text-blue-300">
                Febin | Febiverse
              </span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
