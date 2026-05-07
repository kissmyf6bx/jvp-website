import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import {
  Swiper,
  SwiperSlide
} from "swiper/react";

import { Autoplay } from "swiper/modules";

import "swiper/css";

import {
  doc,
  getDoc
} from "firebase/firestore";

import { db } from "../firebase";

function Mission() {

  const [images, setImages] =
    useState([]);

  const [missionText, setMissionText] =
    useState("");

  // FETCH SETTINGS
  useEffect(() => {

    const fetchSettings =
      async () => {

      const ref = doc(
        db,
        "settings",
        "main"
      );

      const snap =
        await getDoc(ref);

      if (snap.exists()) {

        const data = snap.data();

        setImages(
          data.missionImages || []
        );

        setMissionText(
          data.missionText || ""
        );

      }

    };

    fetchSettings();

  }, []);

  return (
    <section
      id="mission"
      className="
        bg-black
        text-white
        px-6
        py-20
      "
    >

      <div
        className="
          max-w-4xl
          mx-auto
          text-center
        "
      >

        {/* LABEL */}
        <motion.p
          initial={{
            opacity: 0,
            y: 10
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.5
          }}
          className="
            text-xs
            uppercase
            tracking-[0.35em]
            text-gray-500
            mb-5
          "
        >
          Our Mission
        </motion.p>

        {/* TITLE */}
        <motion.h2
          initial={{
            opacity: 0,
            y: 12
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.6
          }}
          className="
            text-4xl
            md:text-6xl
            font-semibold
            tracking-tight
            leading-tight
            mb-8
          "
        >
          Serving Through
          <br />
          Faith & Love
        </motion.h2>

        {/* SLIDESHOW */}
        {images.length > 0 && (

          <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            transition={{
              delay: 0.2
            }}
            className="
              w-full
              max-w-md
              mx-auto
              mb-8
              rounded-[1.8rem]
              overflow-hidden
              border
              border-white/10
              shadow-2xl
            "
          >

            <Swiper
              modules={[Autoplay]}
              autoplay={{
                delay: 2200,
                disableOnInteraction: false,
              }}
              loop={true}
            >

              {images.map(
                (img, i) => (

                <SwiperSlide
                  key={i}
                >

                  <div className="
                    aspect-[16/9]
                  ">

                    <img
                      src={img}
                      alt=""
                      className="
                        w-full
                        h-full
                        object-cover
                      "
                    />

                  </div>

                </SwiperSlide>

              ))}

            </Swiper>

          </motion.div>

        )}

        {/* DESCRIPTION */}
        <motion.p
          initial={{
            opacity: 0,
            y: 10
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 0.3
          }}
          className="
            text-gray-400
            leading-relaxed
            text-sm
            md:text-lg
            max-w-2xl
            mx-auto
          "
        >
          {missionText}
        </motion.p>

      </div>

    </section>
  );
}

export default Mission;