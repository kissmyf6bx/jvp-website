import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function EventsPage() {
  const [events, setEvents] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
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

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-24">

      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="mb-10 text-gray-400"
      >
        ← Back
      </button>

      {/* TITLE */}
      <h1 className="text-5xl font-semibold mb-12">
        All Events
      </h1>

      {/* EVENTS GRID */}
      <div className="grid md:grid-cols-3 gap-8">

        {events.map((event) => (
          <div
            key={event.id}
            onClick={() => navigate(`/event/${event.id}`)}
            className="cursor-pointer bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:scale-[1.02] transition"
          >

            <img
              src={event.images?.[0] || event.image}
              className="w-full h-56 object-cover"
            />

            <div className="p-5">

              <h3 className="text-2xl mb-2">
                {event.title}
              </h3>

              <p className="text-gray-400 text-sm">
                {event.description}
              </p>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default EventsPage;