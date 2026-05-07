import { useEffect, useState } from "react";

import {
  useParams,
  useNavigate
} from "react-router-dom";

import {
  doc,
  getDoc
} from "firebase/firestore";

import { db } from "../firebase";

import { motion } from "framer-motion";

// SWIPER
import {
  Swiper,
  SwiperSlide
} from "swiper/react";

import { Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/autoplay";

function EventDetail() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [event, setEvent] = useState(null);

  // FETCH EVENT
  useEffect(() => {

    const fetchEvent = async () => {

      const ref = doc(
        db,
        "events",
        id
      );

      const snap = await getDoc(ref);

      if (snap.exists()) {

        setEvent({
          id: snap.id,
          ...snap.data()
        });

      }

    };

    fetchEvent();

  }, [id]);

  // LOADING
  if (!event) {

    return (
      <div className="
        h-screen
        bg-black
        text-white
        flex
        items-center
        justify-center
      ">
        Loading...
      </div>
    );

  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="
        min-h-screen
        bg-black
        text-white
      "
    >

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="
          fixed
          top-6
          left-6
          z-50
          bg-black/70
          border
          border-white/20
          backdrop-blur-xl
          px-5
          py-2
          rounded-full
          text-white
          hover:bg-white
          hover:text-black
          transition
        "
      >
        ← Back
      </button>

      {/* IMAGE SLIDER */}
      <div className="h-[50vh]">

        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}
        >

          {(
            event.images &&
            event.images.length > 0
              ? event.images
              : [event.image]
          ).map((img, i) => (

            <SwiperSlide key={i}>

              <img
                src={img}
                alt={`event-${i}`}
                className="
                  w-full
                  h-[50vh]
                  object-cover
                "
              />

            </SwiperSlide>

          ))}

        </Swiper>

      </div>

      {/* CONTENT */}
      <div className="
        max-w-4xl
        mx-auto
        px-6
        py-16
      ">

        {/* TITLE */}
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="
            text-5xl
            md:text-7xl
            font-semibold
            tracking-tight
            mb-6
          "
        >
          {event.title}
        </motion.h1>

        {/* DESCRIPTION */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="
            text-gray-400
            text-lg
            leading-relaxed
            mb-12
          "
        >
          {event.about || event.description}
        </motion.p>

        {/* YOUTUBE BUTTON */}
        {event.youtube && (

          <motion.a
            href={event.youtube}
            target="_blank"
            rel="noreferrer"
            whileTap={{ scale: 0.95 }}
            className="
              inline-flex
              items-center
              gap-2
              bg-white
              text-black
              px-6
              py-3
              rounded-full
              font-medium
              hover:scale-105
              transition
            "
          >
            Watch Highlights
          </motion.a>

        )}

      </div>

    </motion.div>
  );
}

export default EventDetail;