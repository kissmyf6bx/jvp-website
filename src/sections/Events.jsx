import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  query,
  orderBy
} from "firebase/firestore";

import { db } from "../firebase";

import { motion } from "framer-motion";

import { Link } from "react-router-dom";

function Events() {

  const [events, setEvents] = useState([]);

  // FETCH EVENTS
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

  // FILTER DELETED
  const visibleEvents =
    events.filter(e => !e.deleted);

  return (
    <section
      id="events"
      className="
        bg-black
        text-white
        px-6
        py-20
      "
    >

      <div
        className="
          max-w-5xl
          mx-auto
        "
      >

        {/* TITLE */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="
            text-center
            mb-10
          "
        >

          <p
            className="
              text-xs
              uppercase
              tracking-[0.35em]
              text-gray-500
              mb-4
            "
          >
            Parish Events
          </p>

          <h2
            className="
              text-4xl
              md:text-6xl
              font-semibold
              tracking-tight
            "
          >
            Recent Events
          </h2>

        </motion.div>

        {/* EVENTS GRID */}
        <div
          className="
            grid
            grid-cols-2
            gap-4
          "
        >

          {visibleEvents
            .slice(0, 2)
            .map((event, i) => (

            <motion.div
              key={event.id}
              initial={{
                opacity: 0,
                y: 14
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: i * 0.08
              }}
            >

              <Link
                to={`/event/${event.id}`}
              >

                <div
                  className="
                    bg-white/5
                    border
                    border-white/10
                    rounded-[1.5rem]
                    overflow-hidden
                    hover:bg-white/10
                    transition
                  "
                >

                  {/* IMAGE */}
                  <img
                    src={event.image}
                    alt={event.title}
                    className="
                      w-full
                      aspect-[16/10]
                      object-cover
                    "
                  />

                  {/* CONTENT */}
                  <div className="p-3">

                    <h3
                      className="
                        text-sm
                        md:text-lg
                        font-medium
                        mb-1
                        line-clamp-1
                      "
                    >
                      {event.title}
                    </h3>

                    <p
                      className="
                        text-gray-400
                        text-xs
                        md:text-sm
                        line-clamp-2
                      "
                    >
                      {event.description}
                    </p>

                  </div>

                </div>

              </Link>

            </motion.div>

          ))}

        </div>

        {/* VIEW MORE */}
        <div
          className="
            flex
            justify-center
            mt-8
          "
        >

          <Link
            to="/events"
            className="
              text-sm
              bg-white/10
              border
              border-white/10
              px-5
              py-2
              rounded-full
              hover:bg-white
              hover:text-black
              transition
            "
          >
            View More Events
          </Link>

        </div>

      </div>

    </section>
  );
}

export default Events;