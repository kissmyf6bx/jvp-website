import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  Timestamp,
  doc,
  setDoc,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  updateDoc,
  getDoc,
  serverTimestamp
} from "firebase/firestore";
import { loginWithGoogle } from "../utils/auth";

const ADMIN_EMAILS = [
  "jvpyouth23@gmail.com",
  "febinstr339@gmail.com",
  "thirdadmin@gmail.com",
];

function Admin({ user }) {
  const [page, setPage] = useState("home");
  const [events, setEvents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationImage, setNotificationImage] = useState(null);
  const [notificationCanOpen, setNotificationCanOpen] = useState(false);
  const [notificationFullMessage, setNotificationFullMessage] = useState("");

  // EVENT STATES
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [about, setAbout] = useState("");
  const [image, setImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [youtube, setYoutube] = useState("");

  // MEDIA STATES
  const [aboutImages, setAboutImages] = useState([]);
  const [missionImages, setMissionImages] = useState([]);

  // SETTINGS
  const [settings, setSettings] = useState({
    heroTitle: "",
    heroDesc: "",
    heroVideo: "",
    aboutText: "",
    missionText: "",
  });

  // FETCH EVENTS
  const fetchEvents = async () => {
    const q = query(
      collection(db, "events"),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setEvents(data);
  };

  // FETCH SETTINGS
  const fetchSettings = async () => {
    const ref = doc(db, "settings", "main");
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();
      setSettings(data);
      setAboutImages(data.aboutImages || []);
      setMissionImages(data.missionImages || []);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchSettings();
  }, []);

  // LOGIN SCREEN
  if (!user) {
    return (
      <div className="h-screen bg-black text-white flex flex-col items-center justify-center gap-6">
        <h1 className="text-4xl font-semibold">Admin Panel</h1>
        <button
          onClick={async () => {
            setLoading(true);
            await loginWithGoogle();
            setLoading(false);
          }}
          className="bg-white text-black px-6 py-3 rounded-full"
        >
          Login with Google
        </button>
      </div>
    );
  }

  // ACCESS DENIED
  if (!ADMIN_EMAILS.includes(user.email)) {
    return (
      <div className="h-screen bg-black text-white flex items-center justify-center text-3xl">
        Access Denied 🚫
      </div>
    );
  }

  // CLOUDINARY UPLOAD
  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "velankanni-events");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dbwojtnix/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const result = await response.json();
    return result.secure_url;
  };

  // ADD EVENT
  const handleAddEvent = async () => {
    try {
      setLoading(true);

      // COVER
      let coverImageUrl = image;
      if (image instanceof File) {
        coverImageUrl = await uploadToCloudinary(image);
      }

      // GALLERY
      const uploadedGallery = [];
      for (const img of galleryImages) {
        if (typeof img === "string") {
          uploadedGallery.push(img);
          continue;
        }
        const url = await uploadToCloudinary(img);
        uploadedGallery.push(url);
      }

      // UPDATE EVENT
      if (editingId) {
        await updateDoc(doc(db, "events", editingId), {
          title,
          description,
          about,
          image: coverImageUrl,
          images: [coverImageUrl, ...uploadedGallery],
          youtube,
        });
        alert("Event Updated ✅");
      }
      // NEW EVENT
      else {
        await addDoc(collection(db, "events"), {
          title,
          description,
          about,
          image: coverImageUrl,
          images: [coverImageUrl, ...uploadedGallery],
          youtube,
          createdAt: Timestamp.now(),
          deleted: false,
        });
        alert("Event Added ✅");
      }

      // RESET
      setTitle("");
      setDescription("");
      setAbout("");
      setImage(null);
      setGalleryImages([]);
      setYoutube("");
      setEditingId(null);

      fetchEvents();
      setPage("home");

    } catch (err) {
      console.error(err);
      alert("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  // SAVE MEDIA
  const saveMedia = async () => {
    try {
      setLoading(true);

      const uploadImages = async (arr) => {
        const uploaded = [];
        for (const img of arr) {
          if (typeof img === "string") {
            uploaded.push(img);
            continue;
          }
          const url = await uploadToCloudinary(img);
          uploaded.push(url);
        }
        return uploaded;
      };

      const uploadedAbout = await uploadImages(aboutImages);
      const uploadedMission = await uploadImages(missionImages);

      await setDoc(
        doc(db, "settings", "main"),
        {
          aboutImages: uploadedAbout,
          missionImages: uploadedMission,
        },
        { merge: true }
      );

      alert("Media Updated ✅");
    } catch (err) {
      console.error(err);
      alert("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  }; // <-- Added missing closing brace here

  // SEND NOTIFICATION
  const sendNotification = async () => {
    if (!notificationTitle.trim() || !notificationMessage.trim()) {
      alert("Please enter notification title and message");
      return;
    }

    try {
      setLoading(true);

      let notificationImageUrl = "";
      if (notificationImage instanceof File) {
        notificationImageUrl = await uploadToCloudinary(notificationImage);
      }

      await addDoc(collection(db, "notifications"), {
        title: notificationTitle,
        message: notificationMessage,
        image: notificationImageUrl,
        canOpen: notificationCanOpen,
        fullMessage: notificationCanOpen ? notificationFullMessage : "",
        createdAt: serverTimestamp(),
        createdBy: user.email,
        readBy: [],
      });

      setNotificationTitle("");
      setNotificationMessage("");
      setNotificationImage(null);
      setNotificationCanOpen(false);
      setNotificationFullMessage("");

      alert("Notification Sent ✅");
    } catch (err) {
      console.error(err);
      alert("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8 sm:px-6 sm:py-16">
      <div className="max-w-4xl mx-auto">
        {/* TITLE */}
        <h1 className="text-3xl sm:text-5xl font-semibold mb-8 sm:mb-12 leading-tight">
          Velankanni Parish
          <br />
          Website Admin Panel
        </h1>

        {/* HOME */}
        {page === "home" && (
          <div className="space-y-3 sm:space-y-6">
            {/* ADD EVENT */}
            <button
              onClick={() => {
                setEditingId(null);
                setPage("event");
              }}
              className="w-full bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-left hover:bg-white/10 transition active:scale-[0.99]"
            >
              <h2 className="text-xl sm:text-3xl mb-1 sm:mb-2">Add New Event</h2>
              <p className="text-sm sm:text-base text-gray-400">Create parish events</p>
            </button>

            {/* MANAGE EVENTS */}
            <button
              onClick={() => setPage("manage")}
              className="w-full bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-left hover:bg-white/10 transition active:scale-[0.99]"
            >
              <h2 className="text-xl sm:text-3xl mb-1 sm:mb-2">Manage Events</h2>
              <p className="text-sm sm:text-base text-gray-400">Edit or remove events</p>
            </button>

            {/* SETTINGS */}
            <button
              onClick={() => setPage("settings")}
              className="w-full bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-left hover:bg-white/10 transition active:scale-[0.99]"
            >
              <h2 className="text-xl sm:text-3xl mb-1 sm:mb-2">Website Settings</h2>
              <p className="text-sm sm:text-base text-gray-400">Edit texts & hero content</p>
            </button>

            {/* MEDIA */}
            <button
              onClick={() => setPage("media")}
              className="w-full bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-left hover:bg-white/10 transition active:scale-[0.99]"
            >
              <h2 className="text-xl sm:text-3xl mb-1 sm:mb-2">Website Media</h2>
              <p className="text-sm sm:text-base text-gray-400">Manage About & Mission slideshows</p>
            </button>

            {/* NOTIFICATIONS - MOVED INTO HOME MENU */}
            <button
              onClick={() => setPage("notifications")}
              className="w-full bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-left hover:bg-white/10 transition active:scale-[0.99]"
            >
              <h2 className="text-xl sm:text-3xl mb-1 sm:mb-2">Notifications</h2>
              <p className="text-sm sm:text-base text-gray-400">Send parish updates to users</p>
            </button>
          </div>
        )}

        {/* SETTINGS PAGE */}
        {page === "settings" && (
          <div className="space-y-4 sm:space-y-5">
            <button onClick={() => setPage("home")} className="rounded-full bg-white/5 px-4 py-2 text-sm text-gray-300">
              ← Back
            </button>
            <h2 className="text-3xl sm:text-4xl font-semibold">Website Settings</h2>

            {/* HERO TITLE */}
            <input
              placeholder="Hero Title"
              value={settings.heroTitle || ""}
              onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-base outline-none focus:border-white/30"
            />

            {/* HERO DESCRIPTION */}
            <textarea
              placeholder="Hero Description"
              value={settings.heroDesc || ""}
              onChange={(e) => setSettings({ ...settings, heroDesc: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 h-28 text-base outline-none focus:border-white/30"
            />

            {/* HERO VIDEO */}
            <input
              placeholder="Hero Video URL"
              value={settings.heroVideo || ""}
              onChange={(e) => setSettings({ ...settings, heroVideo: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-base outline-none focus:border-white/30"
            />

            {/* ABOUT TEXT */}
            <textarea
              placeholder="About Section Text"
              value={settings.aboutText || ""}
              onChange={(e) => setSettings({ ...settings, aboutText: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 h-40 text-base outline-none focus:border-white/30"
            />

            {/* MISSION TEXT */}
            <textarea
              placeholder="Mission Section Text"
              value={settings.missionText || ""}
              onChange={(e) => setSettings({ ...settings, missionText: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 h-40"
            />

            {/* SAVE */}
            <button
              onClick={async () => {
                try {
                  setLoading(true);
                  await setDoc(doc(db, "settings", "main"), settings, { merge: true });
                  alert("Settings Updated ✅");
                } catch (err) {
                  console.error(err);
                  alert("Something went wrong ❌");
                } finally {
                  setLoading(false);
                }
              }}
              className="bg-white text-black px-6 py-3 rounded-full"
            >
              {loading ? "Saving..." : "Save Settings"}
            </button>
          </div>
        )}

        {/* EVENT PAGE */}
        {page === "event" && (
          <div className="space-y-4 sm:space-y-5">
            <button onClick={() => setPage("home")} className="rounded-full bg-white/5 px-4 py-2 text-sm text-gray-300">
              ← Back
            </button>
            <h2 className="text-3xl sm:text-4xl font-semibold">
              {editingId ? "Edit Event" : "Add Event"}
            </h2>

            {/* TITLE */}
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-base outline-none focus:border-white/30"
            />

            {/* DESCRIPTION */}
            <textarea
              placeholder="Short Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 h-28 text-base outline-none focus:border-white/30"
            />

            {/* ABOUT */}
            <textarea
              placeholder="About Event"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 h-44 sm:h-48 text-base outline-none focus:border-white/30"
            />

            {/* COVER IMAGE */}
            <label className="w-full flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 cursor-pointer text-center text-sm sm:text-base">
              {image ? image.name || "Cover Selected" : "Upload Cover Image"}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>

            {/* GALLERY */}
            <label className="w-full flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 cursor-pointer text-center text-sm sm:text-base">
              {galleryImages.length > 0
                ? `${galleryImages.length} images selected`
                : "Upload Gallery Images"}
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={(e) => setGalleryImages(Array.from(e.target.files))}
              />
            </label>

            {/* YOUTUBE */}
            <input
              placeholder="YouTube Link"
              value={youtube}
              onChange={(e) => setYoutube(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-base outline-none focus:border-white/30"
            />

            {/* SUBMIT */}
            <button
              onClick={handleAddEvent}
              className="w-full sm:w-auto bg-white text-black px-6 py-3 rounded-full"
            >
              {loading ? "Uploading..." : editingId ? "Update Event" : "Add Event"}
            </button>
          </div>
        )}

        {/* MANAGE EVENTS */}
        {page === "manage" && (
          <div className="space-y-4 sm:space-y-6">
            <button onClick={() => setPage("home")} className="rounded-full bg-white/5 px-4 py-2 text-sm text-gray-300">
              ← Back
            </button>
            <h2 className="text-3xl sm:text-4xl font-semibold">Manage Events</h2>

            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-5 mb-4 sm:mb-5"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-xl sm:text-2xl mb-2">{event.title}</h3>
                    <p className="text-sm sm:text-base text-gray-400">{event.description}</p>
                  </div>
                  <img
                    src={event.image}
                    className="w-full h-40 sm:w-24 sm:h-24 object-cover rounded-2xl"
                    alt="Event Cover"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 mt-5 sm:flex">
                  {/* EDIT */}
                  <button
                    onClick={() => {
                      setEditingId(event.id);
                      setTitle(event.title);
                      setDescription(event.description);
                      setAbout(event.about || "");
                      setImage(event.image);
                      setGalleryImages(event.images || []);
                      setYoutube(event.youtube || "");
                      setPage("event");
                    }}
                    className="bg-white text-black px-4 py-2 rounded-full"
                  >
                    Edit
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={async () => {
                      const confirmDelete = confirm("Delete event?");
                      if (!confirmDelete) return;

                      await deleteDoc(doc(db, "events", event.id));
                      fetchEvents();
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded-full"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MEDIA PAGE */}
        {page === "media" && (
          <div className="space-y-6 sm:space-y-10">
            <button onClick={() => setPage("home")} className="rounded-full bg-white/5 px-4 py-2 text-sm text-gray-300">
              ← Back
            </button>
            <h2 className="text-3xl sm:text-4xl font-semibold">Website Media</h2>

            {/* ABOUT */}
            <div className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6">
              <h3 className="text-xl sm:text-2xl mb-5 sm:mb-6">About Section Images</h3>
              <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-4 sm:flex-wrap mb-6">
                {aboutImages.map((img, i) => (
                  <div key={i} className="relative">
                    <img
                      src={typeof img === "string" ? img : URL.createObjectURL(img)}
                      className="w-full h-24 sm:w-28 sm:h-20 object-cover rounded-2xl"
                      alt={`About ${i}`}
                    />
                    <button
                      onClick={() => setAboutImages(aboutImages.filter((_, index) => index !== i))}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <label className="inline-flex w-full sm:w-auto items-center justify-center bg-white text-black px-5 py-3 rounded-full cursor-pointer">
                Add Images
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={(e) => setAboutImages([...aboutImages, ...Array.from(e.target.files)])}
                />
              </label>
            </div>

            {/* MISSION */}
            <div className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6">
              <h3 className="text-xl sm:text-2xl mb-5 sm:mb-6">Mission Section Images</h3>
              <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-4 sm:flex-wrap mb-6">
                {missionImages.map((img, i) => (
                  <div key={i} className="relative">
                    <img
                      src={typeof img === "string" ? img : URL.createObjectURL(img)}
                      className="w-full h-24 sm:w-28 sm:h-20 object-cover rounded-2xl"
                      alt={`Mission ${i}`}
                    />
                    <button
                      onClick={() => setMissionImages(missionImages.filter((_, index) => index !== i))}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <label className="inline-flex w-full sm:w-auto items-center justify-center bg-white text-black px-5 py-3 rounded-full cursor-pointer">
                Add Images
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={(e) => setMissionImages([...missionImages, ...Array.from(e.target.files)])}
                />
              </label>
            </div>

            {/* SAVE MEDIA */}
            <button
              onClick={saveMedia}
              className="w-full sm:w-auto bg-white text-black px-6 py-3 rounded-full"
            >
              {loading ? "Saving..." : "Save Media"}
            </button>
          </div>
        )}

        {/* NOTIFICATIONS PAGE - MOVED OUTSIDE OF MEDIA BLOCK */}
        {page === "notifications" && (
          <div className="space-y-4 sm:space-y-5">
            <button onClick={() => setPage("home")} className="rounded-full bg-white/5 px-4 py-2 text-sm text-gray-300">
              ← Back
            </button>

            <h2 className="text-3xl sm:text-4xl font-semibold">Send Notification</h2>

            <input
              placeholder="Notification Title"
              value={notificationTitle}
              onChange={(e) => setNotificationTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-base outline-none focus:border-white/30"
            />

            <textarea
              placeholder="Notification Message"
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 h-36 sm:h-40 text-base outline-none focus:border-white/30"
            />

            <div className="space-y-4 rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
              <label className="flex cursor-pointer items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl sm:text-2xl mb-2">Openable Notification</h3>
                  <p className="text-sm sm:text-base text-gray-400">
                    Enable this when users should tap the notification to read more.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={notificationCanOpen}
                  onChange={(e) => setNotificationCanOpen(e.target.checked)}
                  className="mt-1 h-5 w-5 shrink-0 accent-white sm:mt-0"
                />
              </label>

              {notificationCanOpen && (
                <textarea
                  placeholder="Full message users can open and read"
                  value={notificationFullMessage}
                  onChange={(e) => setNotificationFullMessage(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-2xl p-4 h-40 sm:h-44 text-base outline-none focus:border-white/30"
                />
              )}
            </div>

            <div className="space-y-4 rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
              <div>
                <h3 className="text-xl sm:text-2xl mb-2">Notification Image</h3>
                <p className="text-sm sm:text-base text-gray-400">
                  This image appears in the bell panel and supported push notifications.
                </p>
              </div>

              {notificationImage && (
                <div className="relative overflow-hidden rounded-2xl border border-white/10">
                  <img
                    src={URL.createObjectURL(notificationImage)}
                    className="h-40 sm:h-48 w-full object-cover"
                    alt="Notification preview"
                  />

                  <button
                    onClick={() => setNotificationImage(null)}
                    className="absolute right-3 top-3 rounded-full bg-red-500 px-4 py-2 text-sm text-white"
                  >
                    Remove
                  </button>
                </div>
              )}

              <label className="inline-flex w-full sm:w-auto cursor-pointer items-center justify-center rounded-full bg-white px-5 py-3 text-black">
                {notificationImage ? "Change Image" : "Add Image"}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => setNotificationImage(e.target.files[0] || null)}
                />
              </label>
            </div>

            <button
              onClick={sendNotification}
              className="w-full sm:w-auto bg-white text-black px-6 py-3 rounded-full"
            >
              {loading ? "Sending..." : "Send Notification"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default Admin;
