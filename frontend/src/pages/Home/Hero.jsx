import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Img1 from "../../assets/hero carosol images/img1.jpg";
import Img2 from "../../assets/hero carosol images/img2.jpg";
import Img3 from "../../assets/hero carosol images/img3.jpg";
import Img4 from "../../assets/hero carosol images/img4.jpg";
import Img5 from "../../assets/hero carosol images/img5.jpg";

import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';

const Hero = () => {
  return (
    <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-2 md:gap-4 px-1 md:px-2 py-1 md:py-2">
      
      {/* Text Section */}
      <div className="w-full md:w-1/2 text-center md:text-left">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800 leading-snug md:leading-tight">
          Welcome to <span className="text-blue-600">Combat Corner</span> Bangladesh
        </h1>
        <p className="mt-1 text-gray-600 text-sm md:text-base max-w-xl mx-auto md:mx-0">
          Dedicated to MMA and boxing in Bangladesh. Focused on the growth and recognition of combat sports across the nation. Get insights into local events, fighter journeys, behind-the-scenes moments, and developments shaping the scene.
        </p>
      </div>

      {/* Carousel Section */}
      <div className="w-full md:w-1/2 max-w-xl mx-auto">
        <Swiper
          slidesPerView={1}
          spaceBetween={15}
          pagination={{ clickable: true }}
          autoplay={{ delay: 1800, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 1, spaceBetween: 15 },
            768: { slidesPerView: 1, spaceBetween: 25 },
            1024: { slidesPerView: 1, spaceBetween: 35 },
          }}
          modules={[Pagination, Autoplay]}
          className="rounded-xl overflow-hidden"
        >
          {[Img1, Img2, Img3, Img4, Img5].map((img, index) => (
            <SwiperSlide key={index}>
              <img
                src={img}
                alt={`Hero slide ${index + 1}`}
                className="w-full h-64 sm:h-80 lg:h-[400px] object-cover rounded-xl shadow-md transition-all duration-700 ease-in-out"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Hero;
