import React,{useState} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import "swiper/css";
import "swiper/css/effect-fade";
import {EffectFade, Autoplay } from "swiper/modules";
import { assets } from '../../assets/assets';
import {motion} from "framer-motion"

const captionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.8, ease: "easeInOut" },
  }),
};


const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  return (

    <div className="w-full relative h-screen z-10 pt-0">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="h-full w-full"
      >

        <SwiperSlide className="relative h-full">

          <img
            src={assets.mobileBanner2}
            className="w-full h-full object-cover md:hidden"
          />
          <img
            src={assets.banner3}
            className="w-full h-full object-cover hidden md:block"
          />

          <div
            className="
              absolute inset-0
              flex
              items-end md:items-center
              justify-center md:justify-start
              px-3 sm:px-4 md:px-11 lg:px-13 xl:px-12 2xl:px-16
              pb-10 md:pb-0
            "
          >
            {activeIndex === 0 && (
              <div>
                <motion.h1
                  className="text-[55px] sm:text-[75px] md:text-[95px] italic font-manustrial text-primary drop-shadow-md text-center md:text-start font-bold"
                  initial="hidden"
                  animate="visible"
                  custom={0.2}
                  variants={captionVariants}
                >
                  PROLOCKER
                </motion.h1>

                <motion.h2
                  className="text-[25px] sm:text-[45px] md:text-[68px] font-bold uppercase text-background drop-shadow-md"
                  initial="hidden"
                  animate="visible"
                  custom={0.5}
                  variants={captionVariants}
                >
                  Suitable for all tastes
                </motion.h2>

                <motion.div
                  className="mt-6 text-center md:text-start"
                  initial="hidden"
                  animate="visible"
                  custom={1}
                  variants={captionVariants}
                >
                  <a href="/products"
                    className="inline-flex items-center gap-3 px-6 py-3 bg-background text-cocoprimary font-semibold rounded-full shadow-lg hover:bg-white/70 transition duration-300">
                    Shop Now
                    <i className="fa-solid fa-arrow-right items-center pt-[3px] md:pt-0.5"></i>
                  </a>
                </motion.div>
              </div>
            )}
          </div>
      </SwiperSlide>


        <SwiperSlide className="relative h-full">

          <img
            src={assets.mobileBanner3}
            className="w-full h-full object-cover md:hidden"
          />
          <img
            src={assets.banner4}
            className="w-full h-full object-cover hidden md:block"
          />

          <div
            className="
              absolute inset-0
              flex
              items-end md:items-center
              justify-center md:justify-start
              px-3 sm:px-4 md:px-11 lg:px-13 xl:px-12 2xl:px-16
              pb-10 md:pb-0
            "
          >
            {activeIndex === 1 && (
              <div>
                <motion.h1
                  className="text-[55px] sm:text-[75px] md:text-[95px] italic font-manustrial text-primary drop-shadow-md text-center md:text-start font-bold"
                  initial="hidden"
                  animate="visible"
                  custom={0.2}
                  variants={captionVariants}
                >
                  Fresh Every Day
                </motion.h1>

                <motion.h2
                  className="text-[25px] sm:text-[45px] md:text-[68px] font-bold uppercase text-background drop-shadow-md md:text-start text-center"
                  initial="hidden"
                  animate="visible"
                  custom={0.5}
                  variants={captionVariants}
                >
                  {new Date().getFullYear()} Collection
                </motion.h2>

                <motion.div
                  className="mt-6 text-center md:text-start"
                  initial="hidden"
                  animate="visible"
                  custom={1}
                  variants={captionVariants}
                >
                    <a href="/products"
                      className="inline-flex items-center gap-3 px-6 py-3 bg-background text-cocoprimary font-semibold rounded-full shadow-lg hover:bg-white/70 transition duration-300">
                      Shop Now
                      <i className="fa-solid fa-arrow-right items-center pt-[3px] md:pt-0.5"></i>
                    </a>
                </motion.div>
              </div>
            )}
          </div>
      </SwiperSlide>

      </Swiper>
    </div>
)
}

export default Hero
