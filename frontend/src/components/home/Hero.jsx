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
    <div className="w-full relative h-[600px] sm:h-[450px] md:h-[500px] lg:h-[600px]">
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
            src={assets.banner1}
            alt="slide 1"
            className="w-full h-full object-cover"
          />

          {activeIndex === 0 && (
            <div className="py-18 relative">
              <motion.h1
                className="text-[60px] sm:text-[75px] md:text-[95px] italic font-manustrial text-primary drop-shadow-md"
                initial="hidden"
                animate="visible"
                custom={0.2}
                variants={captionVariants}
              >
                Summer
              </motion.h1>

              <motion.h2
                className="text-[68px] font-bold uppercase text-[#232323] drop-shadow-md mt-4"
                initial="hidden"
                animate="visible"
                custom={0.5}
                variants={captionVariants}
              >
                20015 collection
              </motion.h2>

              <motion.p
                className="mt-4 text-[17px] font-bold uppercase text-[#232323]"
                initial="hidden"
                animate="visible"
                custom={1}
                variants={captionVariants}
              >
                get upto 50% offer for order over $499!
              </motion.p>
            </div>
          )}
        </SwiperSlide>

        {/* Slide 2 */}
        <SwiperSlide className="relative h-full">
          <img
            src={assets.banner2}
            alt="slide 2"
            className="w-full h-full object-cover"
          />

          {activeIndex === 1 && (
            <div className="absolute top-36 left-28">
              <motion.h1
                className="text-[95px] italic font-manustrial text-[#ff6766] drop-shadow-md"
                initial="hidden"
                animate="visible"
                custom={0.2}
                variants={captionVariants}
              >
                Summer
              </motion.h1>

              <motion.h2
                className="text-[68px] font-bold uppercase text-[#232323] drop-shadow-md mt-4"
                initial="hidden"
                animate="visible"
                custom={0.5}
                variants={captionVariants}
              >
                20015 collection
              </motion.h2>

              <motion.p
                className="mt-4 text-[17px] font-bold uppercase text-[#232323]"
                initial="hidden"
                animate="visible"
                custom={1}
                variants={captionVariants}
              >
                get upto 50% offer for order over $499!
              </motion.p>
            </div>
          )}
        </SwiperSlide>
      </Swiper>
    </div>
  )
}

export default Hero
